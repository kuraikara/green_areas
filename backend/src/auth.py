from urllib import response
from flask import Blueprint, request, jsonify, make_response
from werkzeug.security import check_password_hash, generate_password_hash
import validators
from src.db import User, Session
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, set_access_cookies, set_refresh_cookies, unset_jwt_cookies, verify_jwt_in_request
from flask_cors import CORS

auth = Blueprint('auth', __name__, url_prefix='/auth')
CORS(auth, origins='http://localhost:3000', supports_credentials=True)

@auth.post('/login')
def login():
    password = request.json.get('password', '')
    username = request.json.get('username', '')

    session = Session()
    user = session.query(User).filter_by(username=username).first()
    if user:
        is_password_correct = check_password_hash(user.password, password)
        if is_password_correct:
            reflesh_token = create_refresh_token(identity=user.id)
            access_token = create_access_token(identity=user.id)
            response = jsonify({'access_token': access_token, 'refresh_token': reflesh_token, 'username': user.username, 'role':user.role, 'img': user.img })
            set_refresh_cookies(response, reflesh_token)
            response.status_code = 200
            return response
    return jsonify({'message': 'Invalid credentials'}), 401

@auth.post('/logout')
def logout():
    response = jsonify({'message': 'Successfully logged out'})
    unset_jwt_cookies(response)
    return response

@auth.post('/token/refresh')
@jwt_required(refresh=True)
def refresh_user_token():
    session = Session()
    user_id = get_jwt_identity()
    user = session.query(User).filter_by(id=user_id).first()
    session.close()
    access_token = create_access_token(identity=user_id)
    response = make_response(jsonify({'access_token': access_token, 'username': user.username, 'role':user.role }), 200)
    response.status_code = 200
    
    return response

@auth.post('/me')
@jwt_required()
def me():
    session = Session()
    user_id = get_jwt_identity()
    user = session.query(User).filter_by(id=user_id).first()
    session.close()
    return jsonify({'username': user.username, 'email': user.email }), 200






@auth.post('/signup')
def signup():
    session = Session()
    username = request.json['username']
    password = request.json['password']
    email = request.json['email']
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long.'}), 400
    if len(username) < 4:
        return jsonify({'error': 'Username must be at least 4 characters long.'}), 400
    if not username.isalnum():
        return jsonify({'error': 'Username must be alphanumeric.'}), 400
    if ' ' in username:
        return jsonify({'error': 'Username must not contain spaces.'}), 400
    if not validators.email(email):
        return jsonify({'error': 'Invalid email.'}), 400

    if session.query(User).filter_by(email=email).first() is not None:
        return jsonify({'error': 'Email already exists.'}), 409

    if session.query(User).filter_by(username=username).first() is not None:
        return jsonify({'error': 'Username already exists.'}), 409

    pwd_hash = generate_password_hash(password)
    user = User(username=username, email=email, password=pwd_hash, role='user')

    session.add(user)
    session.commit()
    session.flush()
    session.close()

    return jsonify({'success': 'Account created successfully.'}), 201
