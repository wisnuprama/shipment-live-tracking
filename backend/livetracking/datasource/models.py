from livetracking.datasource import constants

from cassandra.cqlengine import columns
from cassandra.cqlengine.models import Model

from datetime import datetime

from uuid import uuid4


class Shipment(Model):
    shipping_code = columns.UUID(primary_key=True, default=uuid4)
    created_at = columns.DateTime(primary_key=True,
                                required=True,
                                clustering_order="ASC",
                                default=datetime.utcnow)

    inventory_code = columns.Text(primary_key=True,
                                clustering_order="ASC",
                                required=True)
    status = columns.Text(default=constants.K_STATUS_CREATED, required=True)

    # location
    start_name = columns.Text(required=True)
    start_lat = columns.Text(required=True)
    start_lng = columns.Text(required=True)

    destination_name = columns.Text(required=True)
    destination_lat = columns.Text(required=True)
    destination_lng = columns.Text(required=True)

    def set_as_otw(self):
        self.status = constants.K_STATUS_OTW

    def set_as_finished(self):
        self.status = constants.K_STATUS_FINISHED

    @property
    def is_finished(self):
        return self.status == constants.K_STATUS_FINISHED

    def to_dict(self):
        return {
            'shipping_code': str(self.shipping_code)
        }


class Checkpoint(Model):
    # partition with the shipment
    shipping_code = columns.UUID(primary_key=True)
    created_at = columns.DateTime(primary_key=True,
                            required=True,
                            clustering_order="ASC",
                            default=datetime.utcnow)

    location_name = columns.Text(primary_key=True,
                                required=True)
    location_lat = columns.Text(required=True)
    location_lng = columns.Text(required=True)

class LocationLog(Model):
    # partition with the shipment
    shipping_code = columns.UUID(primary_key=True)
    created_at = columns.DateTime(primary_key=True,
                            required=True,
                            clustering_order="ASC",
                            default=datetime.utcnow)
    # track movement
    lat = columns.Text(required=True)
    lng = columns.Text(required=True)
