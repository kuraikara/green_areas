from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
import validators
from src.db import User, Session, Like, Polygon, Follow
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

@social.get("/likes/<username>")
def likes(username):
    session = Session()
    user = session.query(User).filter(User.username == username).first()
    likes = session.query(Like).filter(Like.user).all()
    data = []
    for like in likes:
        data.append({'id': like.polygon_id, 'name': like.polygon.name})
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



@social.post("follow")
def follow():
    user_id = get_jwt_identity()
    followed_id = request.args.get('followed_id')
    session = Session()
    user = session.query(User).filter(User.id == user_id).first()
    followed = session.query(User).filter(User.id == followed_id).first()
    session.add(Follow(user = user, followed = followed))
    session.commit()
    session.close()
    return jsonify({'success': True}), 200

@social.post("unfollow")
def unfollow():
    user_id = get_jwt_identity()
    followed_id = request.args.get('followed_id')
    session = Session()
    user = session.query(User).filter(User.id == user_id).first()
    followed = session.query(User).filter(User.id == followed_id).first()
    follow = session.query(Follow).filter(Follow.user == user, Follow.followed == followed).first()
    session.delete(follow)
    session.commit()
    session.close()
    return jsonify({'success': True}), 200

@social.get("follows/<username>")
def follows(username):
    session = Session()
    user = session.query(User).filter(User.username == username).first()
    follows = session.query(Follow).filter(Follow.user == user).all()
    data = []
    for follow in follows:
        data.append({'username': follow.followed.username, 'img': follow.followed.img})
    session.close()
    return jsonify({'follows': data}), 200

@social.get("users")
def users():
    session = Session()
    users = session.query(User).all()
    data = []
    for user in users:
        data.append({'username': user.username})
    session.close()
    return jsonify({'users': data}), 200

@social.get("/user/<username>")
def user(username):
    session = Session()
    user = session.query(User).filter(User.username == username).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    return jsonify({'username': user.username, 'img': user.img}), 200

@social.get("/searchuser/<value>")
def searchuser(value):
    session = Session()
    users = session.query(User).filter(User.username.like('%' + value + '%')).all()
    data = []
    for user in users:
        data.append({'username': user.username, 'img': user.img})
    session.close()
    return jsonify({'users': data}), 200