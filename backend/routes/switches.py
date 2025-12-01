from flask import Blueprint, request, jsonify
from services.switch_service import SwitchService

switches_bp = Blueprint('switches', __name__)

@switches_bp.route('/', methods=['POST'])
def create_switch():
    data = request.form.to_dict()
    image_file = request.files.get('image')

    user_id = request.headers.get('X-User-ID')
    if not user_id: return jsonify({"error": "Auth Required"}), 401

    try:
        switch = SwitchService.create(data, user_id, image_file)
        return jsonify(switch.to_dict()), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Erro interno"}), 500

@switches_bp.route('/', methods=['GET'])
def list_switches():
    switches = SwitchService.get_all()
    return jsonify([s.to_dict() for s in switches]), 200

@switches_bp.route('/<string:switch_id>', methods=['GET'])
def get_switch(switch_id):
    switch = SwitchService.get_by_id(switch_id)
    if not switch:
        return jsonify({"error": "Switch não encontrado"}), 404
    return jsonify(switch.to_dict()), 200


@switches_bp.route('/<string:switch_id>', methods=['PUT'])
def update_switch(switch_id):
    image_file = None
    data = {}

    if request.is_json:
        data = request.get_json()
    else:
        data = request.form.to_dict()
        image_file = request.files.get('image')

    try:
        updated_switch = SwitchService.update(switch_id, data, image_file)

        if not updated_switch:
            return jsonify({"error": "Switch não encontrado"}), 404
        return jsonify(updated_switch.to_dict()), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Erro interno"}), 500

@switches_bp.route('/<string:switch_id>', methods=['DELETE'])
def delete_switch(switch_id):
    try:
        SwitchService.delete(switch_id)
        return jsonify({"message": "Switch removido com sucesso"}), 200
    except ValueError:
        return jsonify({"error": "Switch não encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500