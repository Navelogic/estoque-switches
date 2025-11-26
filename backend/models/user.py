from extensions import db
from sqlalchemy.sql import text

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, server_default=text("UUID()"))
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=text("CURRENT_TIMESTAMP"))

    logs = db.relationship('AccessLog', backref='user', lazy='dynamic')
    switches_created = db.relationship('Switch', backref='creator', lazy='dynamic')

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "created_at": self.created_at
        }