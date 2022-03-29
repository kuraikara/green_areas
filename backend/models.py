from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ForeignKey
from geoalchemy2 import Geometry
import json
import h3
from shapely.geometry import shape, polygon
from shapely.geometry.polygon import intersects

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
  polygon = Column(Integer, ForeignKey('polygon.id'), primary_key=True, nullable=False)
  h3 = Column(String, ForeignKey('h3area.id'), primary_key=True, nullable=False)


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
    Polygon.__table__.drop(engine)
    H3Area.__table__.drop(engine)
    PolygonByH3.__table__.drop(engine)
    return "Ok"
  except :
    return "Error"

def insert_polygons_from_geojson(geojson):
  try:
    if geojson["type"] == "FeatureCollection":
      polygons = []
      for feature in geojson["features"]:
        session.add(Polygon(name = feature['properties']['name'], geom = (json.dumps(feature['geometry']))))  
    if geojson["type"] == "Feature":
          polyfills = h3.polyfill_geojson(geojson['geometry'], 7)
          intersection = []
          border = []
          #print(geojson['geometry'])
          feature_poly = shape(geojson['geometry'])
          #print(feature_poly)
          for h3index in polyfills:
              h3_poly = polygon.Polygon(h3.h3_to_geo_boundary(h3index))  
              if h3_poly.intersects(feature_poly):
                  print("sium")
                  
      #session.add(Polygon(name = geojson['properties']['name'], geom = (json.dumps(geojson['geometry']))))

    #session.commit()
    return "Ok"
  except Exception as e:
    print(e)
    return "Error"
  
