from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
import validators
from src.db import User, Session, Like, Polygon
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_cors import CORS
from geoalchemy2.functions import ST_AsGeoJSON
import json

social = Blueprint('social', __name__, url_prefix='/social')

CORS(social, origins='http://localhost:3000', supports_credentials=True)

@social.before_request
def before_request():
    if request.path != '/polylikes':
        verify_jwt_in_request()

@social.post("/like")
def like():
    user_id = get_jwt_identity()
    polygon_id = request.args.get('polygon_id')
    session = Session()
    if session.query(Like).filter(Like.user_id == user_id, Like.polygon_id == polygon_id).first():
        return jsonify({'error': 'Already liked'}), 400
    like = Like(user_id=user_id, polygon_id=polygon_id) 
    session.add(like)
    session.commit()
    return polylikes()

@social.post("/unlike")
def unlike():
    user_id = get_jwt_identity()
    polygon_id = request.args.get('polygon_id')
    session = Session()
    like = session.query(Like).filter(Like.user_id == user_id, Like.polygon_id == polygon_id).first()
    if not like:
        return jsonify({'error': 'Not liked'}), 400
    session.delete(like)
    session.commit()
    return polylikes()

@social.get("/likes")
def likes():
    user_id = get_jwt_identity()
    session = Session()
    likes = session.query(Like).filter(Like.user_id == user_id).all()
    data = []
    for like in likes:
        data.append(json.loads(session.query(ST_AsGeoJSON(Polygon)).filter(Polygon.id == like.polygon_id).first()[0]) )
    print(data)
    return {"likes": data}, 200

@social.get("/polylikes")
def polylikes():
    polygon_id = request.args.get('polygon_id')
    user_id = get_jwt_identity()
    session = Session()
    query = session.query(Like).filter(Like.polygon_id == polygon_id)
    liked = False
    for row in query:
        if row.user_id == user_id:
            liked = True
    session.close()
    return {'liked': liked, 'likes': query.count()}, 200

