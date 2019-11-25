from flask import Flask, render_template
from flask_socketio import SocketIO

# from util.validation import validate_chat_message

app = Flask(__name__)
app.config['SECRET_KEY'] = 'ehehehe'
socketio = SocketIO(app)

@app.route('/')
def index():
    return 'Hey, we have Flask in a Docker container!'

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
