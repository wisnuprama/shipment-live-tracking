from flask import request
from flask_socketio import *
from livetracking import socketio

from livetracking.datasource.models import Shipment
from livetracking.datasource.models import LocationLog
from livetracking.socket import constants
from livetracking.util import maps


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


def validate_shipping_code(shipping_code) -> bool:
    """
    check if there is the shipment with the given shipping_code
    """
    return Shipment.objects\
        .filter(shipping_code=shipping_code)\
        .count() > 0


@socketio.on(constants.K_EVENT_JOIN)
def handle_join(data: dict):
    """
    Every shipment has its own room.
    So when there is a new coordinate from other shipment,
    it would not floading the other client who see
    different shipment.
    """
    # check if the shipping code is a valid one
    shipping_code = data.get('shipping_code', None)
    valid = validate_shipping_code(shipping_code)
    if not valid:
        return False

    # client join a shipment room
    join_room(shipping_code, sid=request.sid)

    # send the latest position for the first time after join
    send_latest_location(shipping_code)


@socketio.on(constants.K_EVENT_LEAVE)
def handle_leave(data: dict):
    """
    Every shipment has its own room.
    So when there is a new coordinate from other shipment,
    it would not floading the other client who see
    different shipment.
    """
    # check if the shipping code is a valid one
    shipping_code = data.get('shipping_code', None)
    valid = validate_shipping_code(shipping_code)
    if not valid:
        return False

    # client join a shipment room
    leave_room(shipping_code, sid=request.sid)


def check_has_arrived(shipment: Shipment, new_location: LocationLog) -> bool:
    # arround 100 meters
    is_nearby = maps.is_in_radius(shipment.destination_lat, shipment.destination_lng,
                                  new_location.lat, new_location.lng, 0.1)

    # if the new_location coord is near the shipment destination
    # we will assume the shipment is finished
    if is_nearby:
        shipment.set_as_finished()
        shipment.save()
        emit(constants.K_EVENT_ARRIVED, shipment.to_dict())


@socketio.on(constants.K_EVENT_SEND_COORDINATE)
def on_send_coordinate(data: dict):
    """
    Client (the goods) will tell us its new coordinate
    when they move around.
    """
    # check if the shipping code is a valid one
    shipping_code = data.get('shipping_code', None)
    valid = validate_shipping_code(shipping_code)
    if not valid:
        return False

    shipment: Shipment = Shipment.get(shipping_code=shipping_code)

    # create new LocationLog
    new_location: LocationLog = LocationLog.create(**data)
    shipping_code = str(new_location.shipping_code)
    # emit the new location to client
    emit(constants.K_EVENT_LIVE_TRACKING,
         new_location.to_dict(),
         room=shipping_code)

    # check if has arrived
    check_has_arrived(shipment, new_location)

    # check if the shipment is still new
    # then set as otw
    if shipment.is_new:
        shipment.set_as_otw()
        shipment.save()
