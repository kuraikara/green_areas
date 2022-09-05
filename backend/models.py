from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ForeignKey,Float
from sqlalchemy.orm import relationship, backref, sessionmaker
from geoalchemy2 import Geometry
from geoalchemy2.functions import ST_AsGeoJSON
import json
import h3
from shapely.geometry import shape, polygon, Point

from server import engine
from config import RESOLUTION

Base = declarative_base()
Session = sessionmaker(bind=engine)
session = None


class Polygon(Base):
  __tablename__ = 'polygon'
  id = Column(Integer, primary_key=True)
  #name = Column(String)
  geom = Column(Geometry(srid=4326))
  center = Column(Geometry('POINT'))
  area = Column(Float)
  city_id = Column(Integer, ForeignKey('city.id'))

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
  

class City(Base):
  __tablename__ = 'city'
  id = Column(Integer, primary_key=True)
  name = Column(String)
  center = Column(Geometry('POINT'))
  polygons = relationship('Polygon', backref='city')

def create_tables():
  print( "Creating tables")
  try:
    City.__table__.create(engine)
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
    City.__table__.drop(engine)
    return "Ok"
  except :
    return "Error"


def insert_polygons_from_file(city, filename):
  try:
    print(filename)
    print(city)
    add_city(city)
    with open(filename) as f:
      geojson = json.load(f)
      insert_polygons_from_geojson(geojson, dbCity)
    return "Ok"
  except Exception as e:
    print(e)
    return "Error"

def insert_polygons_from_geojson(geojson, dbCity):
  try:
    if geojson["type"] == "FeatureCollection":
      polygons = []
      for feature in geojson["features"]:
        add_feature_to_db(feature, dbCity)    
    if geojson["type"] == "Feature":
      add_feature_to_db(geojson, dbCity)        
    return "Ok"
  except Exception as e:
    print(e)
    return "Error"


def add_feature_to_db(feature, dbCity):
  session = Session()
  #TODO: Multipoligon or poligon?
  geometryPoly = shape(feature['geometry'])
  dbPoly = Polygon(geom = (json.dumps(feature['geometry'])), center = geometryPoly.centroid.wkt ,area = geometryPoly.area, city_id = dbCity.id )
  session.add(dbPoly)

  for res in RESOLUTION:
    print(res)
    h3Indexes = h3_intersection_from_geometry(geometryPoly, res)
  #adding h3 indexes to db and linking them to the polygon
    for h3Index in h3Indexes:
      if session.query(H3Area).filter(H3Area.id == h3Index).count() == 0:
        area = H3Area(id = h3Index, resolution = res)
        session.add(area) 
      assoc = PolygonByH3(polygon = dbPoly, h3_id = h3Index)
      session.add(assoc)

  session.commit()
  session.flush()
  session.close()
  return

def h3_intersection_from_geometry(geometryPoly, res):
  intersection = [] #list of h3 index of intersection with green area
  border = [] #list of h3 index of intersection borders
  geometryPolyCoords = geometryPoly.centroid.coords
  initH3 = h3.geo_to_h3(geometryPolyCoords[0][1], geometryPolyCoords[0][0], res)
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


def get_city():
  session = Session()
  query = session.query(City.name, ST_AsGeoJSON(City.center))
  data = []

  #TODO json loads and dumps
  for row in query:
    data.append({'name': row[0], 'center': json.loads(list(row)[1]).get('coordinates')})
  session.close()
  return json.dumps(data)


def add_city(name):
  session = Session()
  query = session.query(City).filter(City.name == name)
  print(query)
  ''' dbCity = City(name=name, center='POINT(-0.666085 51.42553)')
  session.add(dbCity)
  session.commit()
  session.close() '''
  return query.__str__()
