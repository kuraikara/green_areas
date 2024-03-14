from flask import Flask, request
import os
from src.auth import auth
from src.db import *
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from src.admin import admin
from src.social import social
from datetime import timedelta


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    CORS(app, origins='http://localhost:3000', supports_credentials=True)
    #CORS(app)
    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_mapping(
            SECRET_KEY= os.environ.get('SECRET_KEY'),
            SQL_DB= os.environ.get('SQL_DB'),
            SQLALCHEMY_TRACK_MODIFICATIONS=False,
            JWT_SECRET_KEY= os.environ.get('JWT_SECRET_KEY'),
            JWT_TOKEN_LOCATION = ['headers','cookies'],
            JWT_SESSION_COOKIE = False,
            JWT_COOKIE_CSRF_PROTECT = False,
            #JWT_ACCESS_TOKEN_EXPIRES = timedelta(seconds=10),
            #JWT_REFRESH_TOKEN_EXPIRES = 20,
        )
    else:
        app.config.from_mapping(test_config)   

    @app.route("/")
    def hello():
        return "Hello"

    @app.route("/setupdb")
    def setupdb():
        return create_tables()

    @app.route("/cleardb")
    def cleardb():
        return drop_tables()

    @app.route("/polygons", methods=["GET"])
    def polygons_get():
        return get_polygons()

    @app.route("/polygon/<id>", methods=["GET"])
    def polygon_get(id):
        return get_polygon_by_id(id), 200

    @app.route("/h3", methods=["GET"])
    def h3_get():
        return get_h3()

    @app.route("/city", methods=["GET"])
    def city_get():
        return get_city()

    @app.route("/polygon", methods=["POST"])
    def polygon_post():
        return insert_polygons_from_geojson(request.json)

    @app.route("/city", methods=["POST"])
    def city_post():
        return json.dumps(add_city(request.args.get('name'))) 

    @app.route("/polygons/<id>", methods=["GET"])
    def polygon_get_by_h3(id):
        return get_polygon_by_h3(id)

    @app.route("/polygons/file", methods=["POST"])
    def polygon_post_files():
        print(request.args.get('name'))
        print( request.args.get('file'))
        return insert_polygons_from_file(request.args.get('name'), request.args.get('file'))
        

    @app.route("/close", methods=["GET"])
    def close_server():
        func = request.environ.get('werkzeug.server.shutdown')
        if func is None:
            raise RuntimeError('Not running with the Werkzeug Server')
        return "ok"

    JWTManager(app)

    app.register_blueprint(auth)
    app.register_blueprint(admin)
    app.register_blueprint(social)

    #setupdb()
        
    return app