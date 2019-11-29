from flask import Flask, render_template
from flask_socketio import SocketIO
from flask_restful import Api
from flask_cors import CORS

from livetracking import settings
from livetracking.datasource.models import Shipment


application = Flask(__name__)
rest_api = Api(application, prefix='/api')
socketio = SocketIO(application, cors_allowed_origins="*")

# CONFIG
application.config['SECRET_KEY'] = settings.SECRET_KEY
application.config['BUNDLE_ERRORS'] = True


def run():
    CORS(application, resources={
         r"/api/*": {"origins": "*"}}, support_credentials=True)
    socketio.run(application, debug=settings.IS_DEVELOPMENT,
                 host=settings.HOST)
