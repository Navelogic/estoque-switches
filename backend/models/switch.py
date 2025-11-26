from extensions import db
from sqlalchemy.sql import text


class Switch(db.Model):
    __tablename__ = 'switches'

    id = db.Column(db.String(36), primary_key=True, server_default=text("UUID()"))
    patrimonio = db.Column(db.String(50), unique=True, nullable=False)
    marca = db.Column(db.String(50), nullable=False)
    modelo = db.Column(db.String(50), nullable=False)
    serial_number = db.Column(db.String(100))
    ip_address = db.Column(db.String(45), unique=True)
    localizacao = db.Column(db.String(100))
    status = db.Column(db.String(20), default='ATIVO')
    created_by = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = db.Column(db.DateTime, server_default=text("CURRENT_TIMESTAMP"), onupdate=text("CURRENT_TIMESTAMP"))

    def to_dict(self):
        return {
            "id": self.id,
            "patrimonio": self.patrimonio,
            "marca": self.marca,
            "modelo": self.modelo,
            "serial_number": self.serial_number,
            "ip_address": self.ip_address,
            "localizacao": self.localizacao,
            "status": self.status,
            "created_by": self.created_by,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }