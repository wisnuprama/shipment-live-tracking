from flask import request
from flask_socketio import Namespace

from livetracking.datasource.models import Shipment
from livetracking.datasource.models import LocationLog
from livetracking.socket import constants


class ShipmentTrackerNamespace(Namespace):

    def get_shipment(self, shipping_code: str) -> Shipment:
        queryset = Shipment.objects.filter(shipping_code=shipping_code)
        return queryset.get()

    def send_latest_location(self, shipping_code):
        latest_location: LocationLog = LocationLog.objects \
            .filter(shipping_code=shipping_code) \
            .last()
        self.emit(constants.K_EVENT_LIVE_TRACKING,
                  latest_location.to_dict(),
                  room=shipping_code)

    def on_join(self, data: dict):
        try:
            shipping_code = data.get('shipping_code', None)
            shipment = self.get_shipment(shipping_code)
        except:
            return False

        self.enter_room(request.sid, room=shipping_code)
        self.send('Success to join',
                  room=shipping_code,
                  callback=self.send_latest_location)

    def on_send_coordinate(self, data: dict):
        # create new LocationLog
        import logging
        logging.info('hahaha')
        new_location: LocationLog = LocationLog.create(**data)
        shipping_code = str(new_location.shipping_code)
        self.emit(constants.K_EVENT_LIVE_TRACKING,
                  new_location.to_dict(),
                  room=shipping_code)
        self.send("Success")
