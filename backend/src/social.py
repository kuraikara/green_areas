from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
import validators
from src.db import User, Session, Like, Polygon, Follow
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_cors import CORS
from geoalchemy2.functions import ST_AsGeoJSON
from sqlalchemy import func
import json

social = Blueprint('social', __name__, url_prefix='/social')

CORS(social, origins='http://localhost:3000', supports_credentials=True)

@social.before_request
def before_request():
    if request.path != '/social/polylikes' :
        verify_jwt_in_request()
    else:
        verify_jwt_in_request(optional=True)

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
    page = int(request.args.get('page'))
    user = session.query(User).filter(User.username == username).first()
    likes = session.query(Like).order_by(Like.when.desc()).filter(Like.user == user).all()
    data = []
    for like in likes:
        data.append({'id': like.polygon_id, 'name': like.polygon.name})
    [data , has_more]= get_paged_data(data, page,5)
    session.close()
    return jsonify({'items': data, 'has_more': has_more  }), 200

@social.get("/polylikes")
def polylikes():
    polygon_id = request.args.get('polygon_id')
    
    user_id = get_jwt_identity()
    session = Session()
    query = session.query(Like).filter(Like.polygon_id == polygon_id)
    liked = False
    followed_liking = []
    if user_id:
        for row in query:
            if row.user_id == user_id:
                liked = True
        
        followed = session.query(Follow).filter(Follow.user_id == user_id).all()
        print(followed)
        for row in followed:
            if session.query(Like).filter(Like.polygon_id == polygon_id, Like.user_id == row.followed_id).first() is not None:
                print(row.followed_id)
                followed_liking.append(row.followed.username)
                break
    session.close()
    return {'liked': liked, 'likes': query.count(), 'followed_liking' : followed_liking}, 200



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
    current_user_id = get_jwt_identity()
    user = session.query(User).filter(User.username == username).first()
    follows = session.query(Follow).filter(Follow.user == user).all()
    page = int(request.args.get('page'))
    data = []
    for follow in follows:
        is_followed =  current_user_id == user.id or session.query(Follow).filter(Follow.user_id == current_user_id, Follow.followed_id == follow.followed_id).first() is not None
        data.append({'username': follow.followed.username, 'img': follow.followed.img, 'is_followed': is_followed})
    session.close()
    [data , has_more]= get_paged_data(data, page, 5)
    session.close()
    return jsonify({'items': data, 'has_more': has_more  }), 200

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
    data.sort(key=lambda x: x['username'])
    session.close()
    return jsonify({'users': data}), 200

@social.get("/feeds")
def getfeeds():
    session = Session()
    page = int(request.args.get('page'))
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
    [data , has_more]= get_paged_data(data, page, 10)
    session.close()
    return jsonify({'items': data, 'has_more': has_more  }), 200


def get_paged_data(data, page, n):
    has_more = len(data) > (page + 1) * n
    data = data[page*n:page*n+n]
    return data, has_more

@social.get("/top")
def gettop():
    session = Session()
    data = []
    likes = session.query(Like.polygon_id, func.count(Like.polygon_id)).group_by(Like.polygon_id).all()
    print(likes)
    for l in likes:
        name = session.query(Polygon.name).filter(Polygon.id == l[0]).first()
        print(name)
        data.append({'id': l[0],'name': name[0], 'score': l[1]})
    data.sort(key=lambda x: x['score'], reverse=True)
    data = data[:50]
    session.close()
    return jsonify(data), 200


@social.get("/search/<value>")
def search(value):
    session = Session()
    current_user_id = get_jwt_identity()
    print(User.username.type)
    users = session.query(User).filter(User.username.ilike(value.lower() + '%')).all()
    polygons = session.query(Polygon).filter(Polygon.name.ilike(value.lower() + '%')).all()
    
    data = []
    for polygon in polygons:
        data.append({'type': 'polygon', 'id': polygon.id, 'name': polygon.name})
    for user in users:
        data.append({'type': 'user', 'name': user.username, 'img': user.img})
    
    data.sort(key=lambda x: x['name'])
    data = data[:10]
    session.close()
    return jsonify({'results': data}), 200