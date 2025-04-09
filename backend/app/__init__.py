from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os
db = SQLAlchemy()

def create_app():
    load_dotenv()

    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })

    with app.app_context():
        from .routes import weather, records, youtube
        app.register_blueprint(weather.weather_bp)
        app.register_blueprint(records.records_bp)
        app.register_blueprint(youtube.youtube_bp)
        db.create_all()

    return app