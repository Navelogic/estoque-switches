from extensions import db
from models import Switch
from sqlalchemy.exc import IntegrityError


class SwitchService:

    @staticmethod
    def _validate_condition(status, condicao):
        if status == 'ATIVO' and condicao == 'NOVO':
            raise ValueError("Regra de Negócio: Um switch ATIVO não pode ser NOVO. Altere a condição para USADO.")

    @staticmethod
    def create(data, user_id):
        required_fields = ['patrimonio', 'marca', 'modelo', 'serial_number']
        for field in required_fields:
            if field not in data:
                raise ValueError(f"O campo {field} é obrigatório.")

        status_input = data.get('status', 'ATIVO')
        condicao_input = data.get('condicao', 'NOVO')

        SwitchService._validate_condition(status_input, condicao_input)

        if Switch.query.filter_by(patrimonio=data['patrimonio']).first():
            raise ValueError("Já existe um switch com este patrimônio.")

        if Switch.query.filter_by(serial_number=data['serial_number']).first():
            raise ValueError("Já existe um switch com este serial.")

        if data.get('ip_address') and Switch.query.filter_by(ip_address=data['ip_address']).first():
            raise ValueError("Já existe um switch com este IP.")

        new_switch = Switch(
            patrimonio=data['patrimonio'],
            marca=data['marca'],
            modelo=data['modelo'],
            serial_number=data['serial_number'],
            ip_address=data.get('ip_address'),
            localizacao=data.get('localizacao'),
            status=status_input,
            condicao=condicao_input,
            created_by=user_id
        )

        try:
            db.session.add(new_switch)
            db.session.commit()
            return new_switch
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def get_all():
        return Switch.query.all()

    @staticmethod
    def get_by_id(switch_id):
        return Switch.query.get(switch_id)

    @staticmethod
    def update(switch_id, data):
        switch = Switch.query.get(switch_id)
        if not switch:
            return None

        new_status = data.get('status', switch.status)
        new_condicao = data.get('condicao', switch.condicao)

        SwitchService._validate_condition(new_status, new_condicao)

        if 'marca' in data: switch.marca = data['marca']
        if 'modelo' in data: switch.modelo = data['modelo']
        if 'localizacao' in data: switch.localizacao = data['localizacao']
        if 'status' in data: switch.status = data['status']
        if 'condicao' in data: switch.condicao = data['condicao']
        if 'ip_address' in data: switch.ip_address = data['ip_address']

        try:
            db.session.commit()
            return switch
        except IntegrityError:
            db.session.rollback()
            raise ValueError("Erro ao atualizar: IP já em uso.")
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def delete(switch_id):
        switch = Switch.query.get(switch_id)
        if not switch:
            raise ValueError("Switch não encontrado.")

        try:
            db.session.delete(switch)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e