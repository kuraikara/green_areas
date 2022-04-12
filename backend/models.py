from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, backref, sessionmaker
from geoalchemy2 import Geometry
from geoalchemy2.functions import ST_AsGeoJSON
import json
import h3
from shapely.geometry import shape, polygon

from server import engine
from config import RESOLUTION

Base = declarative_base()
Session = sessionmaker(bind=engine)
session = None


class Polygon(Base):
  __tablename__ = 'polygon'
  id = Column(Integer, primary_key=True)
  name = Column(String)
  geom = Column(Geometry(srid=4326))

class H3Area(Base):
  __tablename__ = 'h3area'
  id = Column(String, primary_key=True, autoincrement=False, nullable=False)
  resolution = Column(Integer, default = 7)

class PolygonByH3(Base):
  __tablename__ = 'polygonByH3'
  polygon_id = Column(Integer, ForeignKey('polygon.id'), primary_key=True, nullable=False)
  h3_id = Column(String, ForeignKey('h3area.id'), primary_key=True, nullable=False)
  polygon = relationship('Polygon')
  h3 = relationship('H3Area')

def create_tables():
  print( "Creating tables")
  try:
    Polygon.__table__.create(engine)
    H3Area.__table__.create(engine)
    PolygonByH3.__table__.create(engine)
    return "Ok"
  except :
    return "Error"

def drop_tables():
  try:
    PolygonByH3.__table__.drop(engine)
    Polygon.__table__.drop(engine)
    H3Area.__table__.drop(engine)
    return "Ok"
  except :
    return "Error"

def insert_polygons_from_geojson(geojson):
  try:
    if geojson["type"] == "FeatureCollection":
      polygons = []
      for feature in geojson["features"]:
        add_feature_to_db(feature)    
    if geojson["type"] == "Feature":
      add_feature_to_db(geojson)        
    return "Ok"
  except Exception as e:
    print(e)
    return "Error"


def add_feature_to_db(feature):
  session = Session()
  #TODO: Multipoligon or poligon?
  dbPoly = Polygon(name = feature['properties']['name'], geom = (json.dumps(feature['geometry'])))
  session.add(dbPoly)

  h3Indexes = h3_intersection_from_geometry(feature['geometry'])

  #adding h3 indexes to db and linking them to the polygon
  for h3Index in h3Indexes:
    if session.query(H3Area).filter(H3Area.id == h3Index).count() == 0:
      area = H3Area(id = h3Index, resolution = RESOLUTION)
      session.add(area) 
    assoc = PolygonByH3(polygon = dbPoly, h3_id = h3Index)
    session.add(assoc)

  session.commit()
  session.flush()
  session.close()
  return

def h3_intersection_from_geometry(geometry):
  geometryPoly = shape(geometry) #green area in shapely polygon
  intersection = [] #list of h3 index of intersection with green area
  border = [] #list of h3 index of intersection borders
  geometryPolyCoords = geometryPoly.centroid.coords
  initH3 = h3.geo_to_h3(geometryPolyCoords[0][1], geometryPolyCoords[0][0], RESOLUTION)
  print(initH3)
  intersection.append(initH3)
  border.append(initH3)

  #while there is border add the neighbor that intersects green area to the list
  while len(border) > 0:
    h3index = border.pop(0)
    neighbours = h3.k_ring(h3index, 1)
    for neighbor in neighbours:
      if ((neighbor in intersection) == False):
        neighborPoly = polygon.Polygon(h3.h3_to_geo_boundary(neighbor, True))
        if (neighborPoly.overlaps(geometryPoly) == True):
          intersection.append(neighbor)
          border.append(neighbor) 

  return intersection


def get_polygons():
  session = Session()
  query = session.query(ST_AsGeoJSON(Polygon))#.filter(Area.id == 55)
  data = {
    "type": "FeatureCollection",                                                                               
    "features": []}

  for row in query:
    data["features"].append(json.loads(list(row)[0]))
  session.close()
  return json.dumps(data)


def get_polygon_by_h3(h3_id):
  session = Session()
  query = session.query(ST_AsGeoJSON(Polygon)).join(PolygonByH3).filter(PolygonByH3.h3_id == h3_id)
  data = []

  #TODO json loads and dumps
  for row in query:
    data.append(json.loads(list(row)[0]))
  session.close()
  return json.dumps(data)

def get_h3():
  session = Session()
  query = session.query(H3Area.id)
  data = []

  for row in query:
    data.append(row[0])
  session.close()
  return json.dumps(data)

  
