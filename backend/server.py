from flask import Flask, request
from flask_cors import cross_origin
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import json

from models import *

app = Flask(__name__)
engine = create_engine('postgresql://postgres:yxot@localhost/stage', echo=True)
Session = sessionmaker(bind=engine)
session = Session()

@app.route("/")
@cross_origin()
def hello():
    return "Hello"

@app.route("/setupdb")
@cross_origin()
def setupdb():
    return create_tables()

@app.route("/cleardb")
@cross_origin()
def cleardb():
    return drop_tables()

@app.route("/polygon", methods=["POST"])
@cross_origin()
def polygon_post():
    return insert_polygons_from_geojson(request.json)
    


if __name__ == "__main__":
    app.run(debug=True)