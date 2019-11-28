from flask import request
from flask_socketio import *
from livetracking import socketio

from livetracking.datasource.models import Shipment
from livetracking.datasource.models import LocationLog
from livetracking.socket import constants


def send_latest_location(shipping_code):
    """
    Tell the client (receiver people) the latest position
    of the goods.
    """
    # query latest
    latest_location: LocationLog = LocationLog.objects \
        .filter(shipping_code=shipping_code) \
        .order_by('-created_at')\
        .limit(1)\
        .get()

    # tell the client
    emit(constants.K_EVENT_LIVE_TRACKING,
         latest_location.to_dict(),
         room=shipping_code)


@socketio.on(constants.K_EVENT_JOIN)
def handle_join(data: dict):
    """
    Every shipment has its own room.
    So when there is a new coordinate from other shipment,
    it would not floading the other client who see
    different shipment.
    """
    try:
        # check if the shipping code is a valid one
        shipping_code = data.get('shipping_code', None)
        shipment = Shipment.get(shipping_code=shipping_code)
    except:
        return False

    # client join a shipment room
    join_room(shipping_code, sid=request.sid)

    # send the latest position for the first time after join
    send_latest_location(shipping_code)


@socketio.on(constants.K_EVENT_SEND_COORDINATE)
def on_send_coordinate(data: dict):
    """
    Client (the goods) will tell us its new coordinate
    when they move around.
    """
    # create new LocationLog
    new_location: LocationLog = LocationLog.create(**data)
    shipping_code = str(new_location.shipping_code)
    emit(constants.K_EVENT_LIVE_TRACKING,
         new_location.to_dict(),
         room=shipping_code)
