from sqlalchemy.ext.declarative import declarative_base
from flask_sqlalchemy import SQLAlchemy 
from sqlalchemy import create_engine,Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship, sessionmaker
from geoalchemy2 import Geometry
from geoalchemy2.functions import ST_AsGeoJSON
import json
import h3
from shapely.geometry import shape, polygon, Point
import os
from werkzeug.security import generate_password_hash
from flask_jwt_extended import get_jwt_identity
from datetime import datetime

#RESOLUTION = os.environ.get('RESOLUTION')
RESOLUTION = [6, 7 , 8]

Base = declarative_base()
engine = create_engine(os.environ.get('SQL_DB'), echo=True)
Session = sessionmaker(bind=engine, autoflush=False)
session = None


class Polygon(Base):
    __tablename__ = 'polygon'
    id = Column(Integer, primary_key=True)
    geometry = Column(Geometry(srid=4326), nullable=False)
    center = Column(Geometry('POINT'), nullable=False)
    area = Column(Float)
    city_id = Column(Integer, ForeignKey('city.id'), nullable=False)
    name = Column(String(100), nullable=False, default='Name poly')
    def __repr__(self):
        return f"Polygon('{self.id}')"

class City(Base):
    __tablename__ = 'city'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    center = Column(Geometry('POINT'), nullable=False)
    polygons = relationship('Polygon', backref='city', lazy=True)

    def __repr__(self):
        return f"City( '{self.id}', '{self.name}')"

class H3Area(Base):
    __tablename__ = 'h3area'
    id = Column(String(255), primary_key=True, autoincrement=False, nullable=False)
    resolution = Column(Integer, nullable=False)

    def __repr__(self):
        return f"H3Area('{self.id}')"

class PolygonByH3(Base):
    __tablename__ = 'polygonByH3'
    polygon_id = Column(Integer, ForeignKey('polygon.id'), primary_key=True, nullable=False)
    h3_id = Column(String, ForeignKey('h3area.id'), primary_key=True, nullable=False)
    polygon = relationship('Polygon')
    h3 = relationship('H3Area')

    def __repr__(self):
        return f"PolygonByH3('{self.polygon_id}', '{self.h3_id}')"

class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(10), nullable=False, default='user')
    img = Column(String(255), nullable=False, default='https://via.placeholder.com/150')

class Like(Base):
    __tablename__ = 'like'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    polygon_id = Column(Integer, ForeignKey('polygon.id'), nullable=False)
    when = Column(String(255), nullable=False, default=datetime.now().timestamp())
    polygon = relationship('Polygon')
    user = relationship('User')
  

    def __repr__(self):
        return f"Like('{self.id}', '{self.user_id}', '{self.polygon_id}')"

class Follow(Base):
    __tablename__ = 'follow'
    id = Column(Integer, primary_key=True)
    followed_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    when = Column(String(255), nullable=False, default=datetime.now().timestamp())
    user = relationship("User", foreign_keys=[user_id])
    followed = relationship("User", foreign_keys=[followed_id])

    def __repr__(self):
        return f"Follow('{self.id}', '{self.user_id}', '{self.followed_id}')"



def create_tables():
    if City.__table__.exists(engine) is False: 
      City.__table__.create(engine)
    if Polygon.__table__.exists(engine) is False: 
      Polygon.__table__.create(engine)
    if H3Area.__table__.exists(engine) is False: 
      H3Area.__table__.create(engine)
    if PolygonByH3.__table__.exists(engine) is False: 
      PolygonByH3.__table__.create(engine)
    if User.__table__.exists(engine) is False:
      User.__table__.create(engine)
    session = Session()
    if session.query(User).filter_by(username="admin").first() is None:
          admin = User(username="admin", email="admin@localhost", password=generate_password_hash("admin"), role="admin")
          session.add(admin)
          session.commit()
    if Like.__table__.exists(engine) is False:
          Like.__table__.create(engine)
    if Follow.__table__.exists(engine) is False:
          Follow.__table__.create(engine)
    session.close()
    return "Ok", 200

def drop_tables():
    try:
        if PolygonByH3.__table__.exists(engine):
          PolygonByH3.__table__.drop(engine)
        if Like.__table__.exists(engine):
              Like.__table__.drop(engine)
        if Polygon.__table__.exists(engine):
          Polygon.__table__.drop(engine)
        if H3Area.__table__.exists(engine):
          H3Area.__table__.drop(engine)
        if City.__table__.exists(engine):
          City.__table__.drop(engine)
        if Follow.__table__.exists(engine):
          Follow.__table__.drop(engine)
        if User.__table__.exists(engine):
          User.__table__.drop(engine)
        
        return "Ok"
    except :
        return "Error"


def insert_polygons_from_file(city, filename):
  try:
    print(filename)
    print(city)
    session = Session()
    city_id = add_city(city)
    
    session.close()

    with open(filename) as f:
      geojson = json.load(f)
      insert_polygons_from_geojson(geojson, city_id)
    return "Ok"
  except Exception as e:
    print(e)
    return "Error"

def insert_polygons_from_geojson(geojson, city_id):
  try:
    if geojson["type"] == "FeatureCollection":
      polygons = []
      for feature in geojson["features"]:
        add_feature_to_db(feature, city_id)    
    if geojson["type"] == "Feature":
      add_feature_to_db(geojson, city_id)        
    return "Ok"
  except Exception as e:
    print(e)
    return "Error"


def add_feature_to_db(feature, city_id):
  session = Session()
  dbCity = session.query(City).filter(City.id == city_id).first()
  #TODO: Multipoligon or poligon?
  geometryPoly = shape(feature['geometry'])
  dbPoly = Polygon(geometry = (json.dumps(feature['geometry'])), center = geometryPoly.centroid.wkt ,area = geometryPoly.area, city_id = dbCity.id )
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
  query = session.query(City).filter(City.name == name).first()
  if(query is not None): 
    session.close()
    return query.id

  dbCity = City(name=name, center='POINT(-0.666085 51.42553)')
  session.add(dbCity)
  session.commit()
  query = session.query(City).filter(City.name == name).first()
  session.close()
  return query.id

def get_polygon_by_id(id):
  print(id)

  session = Session()
  query = session.query(ST_AsGeoJSON(Polygon)).filter(Polygon.id == id).first()

  print(query)

  data = json.loads(list(query)[0])
  session.close()
  return json.dumps(data)

