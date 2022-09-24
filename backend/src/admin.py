from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
import validators
from src.db import User, Session
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask_cors import CORS

admin = Blueprint('admin', __name__, url_prefix='/admin')

CORS(admin, origins='http://localhost:3000', supports_credentials=True)

@admin.get('/users')
@jwt_required()
def users():
    
    session = Session()
    user_id = get_jwt_identity()
    user = session.query(User).filter_by(id=user_id).first()
    if user is None or user.role != 'admin':
        response = jsonify({'message': 'No permission'})
        return response, 404
    data = session.query(User).all()
    ret = []
    for user in data:
        ret.append({'username': user.username, 'email': user.email, 'role': user.role})
    session.close()
    response = jsonify(ret)
    return response, 200

@admin.post('/user')
@jwt_required()
def user():
    session = Session()
    user_id = get_jwt_identity()
    user = session.query(User).filter_by(id=user_id).first()
    if user is None or user.role != 'admin':
        response = jsonify({'message': 'No permission'})
        return response, 404
