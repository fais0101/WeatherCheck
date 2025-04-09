from .weather import weather_bp
from .records import records_bp

def register_routes(app):
    app.register_blueprint(weather_bp)
    app.register_blueprint(records_bp)