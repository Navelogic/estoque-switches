from extensions import db
from sqlalchemy.sql import text

class AccessLog(db.Model):
    __tablename__ = 'access_logs'

    id = db.Column(db.String(36), primary_key=True, server_default=text("UUID()"))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    action_type = db.Column(db.String(20), nullable=False)
    timestamp = db.Column(db.DateTime, server_default=text("CURRENT_TIMESTAMP"))