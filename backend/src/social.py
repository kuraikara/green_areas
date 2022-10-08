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
    likes = session.query(Like).filter(Like.user == user).all()
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
    followed_username = request.args.get('username')
    print(followed_username)
    session = Session()
    user = session.query(User).filter(User.id == user_id).first()
    followed = session.query(User).filter(User.username == followed_username).first()
    session.add(Follow(user = user, followed = followed))
    session.commit()
    session.close()
    return getuser(followed_username)

@social.post("unfollow")
def unfollow():
    user_id = get_jwt_identity()
    followed_username = request.args.get('username')
    session = Session()
    user = session.query(User).filter(User.id == user_id).first()
    followed = session.query(User).filter(User.username == followed_username).first()
    follow = session.query(Follow).filter(Follow.user == user, Follow.followed == followed).first()
    session.delete(follow)
    session.commit()
    session.close()
    return getuser(followed_username)

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
def getuser(username):
    session = Session()
    current_user_id = get_jwt_identity()
    user = session.query(User).filter(User.username == username).first()
    followed_num = session.query(Follow).filter(Follow.user == user).count()
    followers_num = session.query(Follow).filter(Follow.followed == user).count()
    is_user_followed = session.query(Follow).filter(Follow.user_id == current_user_id, Follow.followed == user).first() is not None

    print("PROVA")
    print(is_user_followed)
    session.close()

    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'username': user.username, 'img': user.img, 'followed': followed_num, 'followers': followers_num, 'is_followed': is_user_followed}), 200

@social.get("/searchuser/<value>")
def searchuser(value):
    session = Session()
    current_user_id = get_jwt_identity()
    users = session.query(User).filter(User.username.like('%' + value + '%')).all()
    
    data = []
    for user in users:
        is_user_followed = session.query(Follow).filter(Follow.user_id == current_user_id, Follow.followed == user).first() is not None
        data.append({'username': user.username, 'img': user.img, 'is_followed': is_user_followed })
    session.close()
    return jsonify({'users': data}), 200

@social.get("/feeds")
def getfeeds():
    session = Session()
    ''' page = request.args.get('page') '''
    current_user_id = get_jwt_identity()
    user = session.query(User).filter(User.id == current_user_id).first()
    follows = session.query(Follow).filter(Follow.user == user).all()
    data = []
    for follow in follows:
        likes = session.query(Like).filter(Like.user == follow.followed).all()
        follow_follows = session.query(Follow).filter(Follow.user == follow.followed).all()
        for like in likes:
            data.append({'type': 'like', 'username': follow.followed.username, 'img': follow.followed.img, 'polygon_id': like.polygon_id, 'polygon_name': like.polygon.name, 'when': like.when})
        for follow_follow in follow_follows:
            data.append({ 'type': 'follow', 'username': follow.followed.username, 'img': follow.followed.img, 'followed' : follow_follow.followed.username, 'when': follow_follow.when})

    data.sort(key=lambda x: x['when'], reverse=True)
        
    session.close()
    return jsonify({'feeds': data}), 200