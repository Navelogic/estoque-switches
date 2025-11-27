from flask import Blueprint, request, jsonify
from services.user_service import UserService

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        new_user = UserService.create(data)
        return jsonify({"message": "Criado com sucesso", "user": new_user.to_dict()}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Erro interno do servidor"}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Dados incompletos"}), 400

    user = UserService.authenticate(username, password)

    if user:
        return jsonify({"message": "Login OK", "user_id": user.id, "username": user.username}), 200

    return jsonify({"error": "Credenciais inválidas"}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    data = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"error": "user_id é obrigatório para logout"}), 400

    try:
        UserService.logout(user_id)
        return jsonify({"message": "Logout realizado com sucesso"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": "Erro interno do servidor"}), 500