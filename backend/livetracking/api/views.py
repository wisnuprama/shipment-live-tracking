import logging

from flask_restful import Resource
from flask_restful import NotFound
from flask_restful.reqparse import RequestParser

from cassandra.cqlengine import ValidationError

from livetracking.datasource.models import Model
from livetracking.datasource.models import Shipment
from livetracking.datasource.models import Checkpoint
from livetracking.datasource.models import LocationLog
from livetracking.util.errorcql import parseValidationErrToDict

from livetracking.api import parsers

logger = logging.getLogger('REST API')


class AbstractListCreate(Resource):
    """
    Abstract class of ListCreate
    """
    model: Model = None
    parser: RequestParser = None

    def get_queryset(self, **kwargs):
        if not self.model:
            return None
        if len(kwargs) > 0:
            return self.model.objects.filter(**kwargs)
        return self.model.objects.all()

    def perform_create(self, data: dict, **kwargs):
        return self.model.create(**data)

    def get(self, **kwargs):
        queryset = self.get_queryset(**kwargs)
        if not queryset:
            return []
        return [item.to_dict() for item in queryset]

    def post(self, **kwargs):
        data = self.parser.parse_args()
        try:
            instance = self.perform_create(data, **kwargs)
            return instance.to_dict(), 201
        except ValidationError as e:
            return parseValidationErrToDict(str(e)), 400


class ShipmentListCreate(AbstractListCreate):
    """
    [POST]
    Create new shipment

    [GET]
    Retrieve all shipments
    """
    model = Shipment
    parser = parsers.shipment_parser


class CheckpointListCreate(AbstractListCreate):
    """
    [POST]
    Create new checkpoint of shipment

    [GET]
    Retrieve all checkpoints of shipment
    """
    model = Checkpoint
    parser = parsers.checkpoint_parser

    def perform_create(self, data: dict, **kwargs):
        new_data = data.copy()
        new_data['shipping_code'] = kwargs.get('shipping_code')
        return super().perform_create(new_data, **kwargs)


class LocationLogListCreate(AbstractListCreate):
    """
    [POST]
    Create new location log

    [GET]
    Retrieve all location logs of a shipment
    """
    model = LocationLog
    parser = parsers.location_log_parser

    def perform_create(self, data: dict, **kwargs):
        new_data = data.copy()
        new_data['shipping_code'] = kwargs.get('shipping_code')
        return super().perform_create(new_data, **kwargs)


class ShipmentDetail(Resource):
    """
    [GET]
    Retrieve detail of the shipment
    """

    def get(self, shipping_code: str):
        shipment: Shipment = Shipment.get(shipping_code=shipping_code)
        checkpoints: list = Checkpoint.objects.filter(
            shipping_code=shipping_code)

        response: dict = shipment.to_dict()
        response['checkpoints'] = [cp.to_dict() for cp in checkpoints]

        return response
