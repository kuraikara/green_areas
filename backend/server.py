from ast import Return
from json import JSONDecoder, JSONEncoder
from flask import Flask, request, jsonify
from flask_cors import cross_origin
from sqlalchemy import create_engine
import sys

from multiprocessing import Process

from models import *
from config import DB_TOKEN

app = Flask(__name__)
#app.config.from_envvar('APP_CONFIG')
engine = create_engine(DB_TOKEN, echo=True)


@app.route("/")
@cross_origin()
def hello():
    return jsonify("Hello")

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

@app.route("/city", methods=["GET"])
@cross_origin()
def city_get():
    return get_city()

@app.route("/polygon", methods=["POST"])
@cross_origin()
def polygon_post():
    return insert_polygons_from_geojson(request.json)

@app.route("/city", methods=["POST"])
@cross_origin()
def city_post():
    return json.dumps(add_city(request.args.get('name'))) 

@app.route("/polygon/<id>", methods=["GET"])
@cross_origin()
def polygon_get_by_h3(id):
    return get_polygon_by_h3(id)

@app.route("/polygon/file", methods=["POST"])
@cross_origin()
def polygon_post_files():
    print(request.args.get('name'))
    print( request.args.get('file'))
    return insert_polygons_from_file(request.args.get('name'), request.args.get('file'))
    

@app.route("/close", methods=["GET"])
@cross_origin()
def close_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    return "ok"
    
    
    

if __name__ == '__main__':
    app.run(debug=True)