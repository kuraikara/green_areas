from flask import Flask, request
from flask_cors import cross_origin
from sqlalchemy import create_engine
import json

from models import *
from config import DB_TOKEN

app = Flask(__name__)
engine = create_engine(DB_TOKEN, echo=True)


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

@app.route("/polygon", methods=["GET"])
@cross_origin()
def polygon_get():
    return get_polygons()

@app.route("/h3", methods=["GET"])
@cross_origin()
def h3_get():
    return get_h3()

@app.route("/polygon", methods=["POST"])
@cross_origin()
def polygon_post():
    return insert_polygons_from_geojson(request.json)

@app.route("/polygon/<id>", methods=["GET"])
@cross_origin()
def polygon_get_by_h3(id):
    return get_polygon_by_h3(id)

@app.route("/polygon/files", methods=["POST"])
@cross_origin()
def polygon_post_files():
    return insert_polygons_from_file('./London')
    


if __name__ == "__main__":
    app.run(debug=True)