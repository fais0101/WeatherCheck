from app import create_app
from flask_socketio import SocketIO
from flask_cors import CORS

app = create_app()
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")

if __name__ == '__main__':
    socketio.run(app, debug=True, port=8080)