from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, backref
from geoalchemy2 import Geometry
import json
import h3
from shapely.geometry import shape, polygon

from server import engine, session

Base = declarative_base()

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
        add_feature_to_db(feature['geometry'])    
    if geojson["type"] == "Feature":
      add_feature_to_db(geojson['geometry'])         
    return "Ok"
  except Exception as e:
    print(e)
    return "Error"


def add_feature_to_db(feature):
          #TODO: Multipoligon or poligon?
          dbPoly = Polygon(name = feature['properties']['name'], geom = (json.dumps(feature['geometry'])))
          session.add(dbPoly)
          polyfills = h3.polyfill_geojson(feature['geometry'], 7)
          intersection = []
          border = []
          feature_poly = shape(feature['geometry'])
          for h3index in polyfills:
              h3_poly = polygon.Polygon(h3.h3_to_geo_boundary(h3index, True)) 
              if (h3_poly.overlaps(feature_poly) == True):
                  intersection.append(h3index)
                  border.append(h3index)
              else:
                  intersection.append(h3index)
          while len(border) > 0:
              h3index = border.pop(0)
              ring = h3.k_ring(h3index, 1)
              for neighbor in ring:
                if (neighbor in intersection) == False:
                  neighborPoly = polygon.Polygon(h3.h3_to_geo_boundary(neighbor, True))
                  if (neighborPoly.overlaps(feature_poly) == True):
                      intersection.append(neighbor)
                      border.append(neighbor)   

          for index in intersection:
            print(session.query(H3Area).filter(H3Area.id == index).count())
            if session.query(H3Area).filter(H3Area.id == index).count() == 0:
              area = H3Area(id = index, resolution = 7)
              session.add(area) 
            assoc = PolygonByH3(polygon = dbPoly, h3_id = index)
            session.add(assoc)

          session.commit()  
          return
  
