from flask import Flask, render_template
from flask_socketio import SocketIO

from util.validation import validate_chat_message

app = Flask(__name__)
app.config['SECRET_KEY'] = 'ehehehe'
socketio = SocketIO(app)

if __name__ == '__main__':
    socketio.run(app)

@socketio.io("json")
def handle_chat_message(data):
    if validate_chat_message(json):
        # do something pass
        pass
