import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from extensions import db, migrate
from routes.switches import switches_bp
from routes.auth import auth_bp

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(switches_bp, url_prefix='/api/switches')

    @app.route('/')
    def index():
        return {"status": "API Online", "version": "1.0.0"}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)