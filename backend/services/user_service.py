from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db
from models import User, AccessLog


class UserService:

    @staticmethod
    def create(data):
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            raise ValueError("Username e senha obrigatórios")

        if User.query.filter_by(username=username).first():
            raise ValueError("Usuário já existe")

        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password_hash=hashed_password)

        try:
            db.session.add(new_user)
            db.session.commit()
            return new_user
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def authenticate(username, password):
        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password_hash, password):
            log = AccessLog(user_id=user.id, action_type='LOGIN')
            db.session.add(log)
            db.session.commit()
            return user

        return None

    @staticmethod
    def logout(user_id):
        user = User.query.get(user_id)
        if not user:
            raise ValueError("Usuário não encontrado para logout")

        try:
            log = AccessLog(user_id=user.id, action_type='LOGOUT')
            db.session.add(log)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def get_all():
        return User.query.all()

    @staticmethod
    def get_by_id(user_id):
        return User.query.get(user_id)

    @staticmethod
    def delete(user_id):
        user = User.query.get(user_id)
        if not user:
            raise ValueError("Usuário não encontrado")

        try:
            db.session.delete(user)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e