from flask import Flask, render_template
from flask_socketio import SocketIO

from livetracking import settings
from livetracking.datasource.models import Shipment

app = Flask(__name__)
app.config['SECRET_KEY'] = settings.SECRET_KEY
socketio = SocketIO(app)

@app.route('/')
def index():
    import json
    shipment = Shipment.create(inventory_code='haha',
                            start_name='home',
                            start_lat='222',
                            start_lng='2222',
                            destination_name='school',
                            destination_lat='222333',
                            destination_lng='2555')
    return 'PDB :P' + json.dumps(shipment.to_dict()) + 'hahaha'

def run():
    import livetracking.datasource.db
    socketio.run(app, debug=settings.IS_DEVELOPMENT, host=settings.HOST)
run()
