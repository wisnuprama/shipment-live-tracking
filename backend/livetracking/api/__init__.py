from flask_restful import Api
from livetracking import application

from livetracking.api import views

rest_api = Api(application, prefix='/api')

resources = [
    (views.ShipmentListCreate, '/shipments'),
    (views.ShipmentDetail, '/shipments/<shipping_code>'),

    (views.CheckpointListCreate, '/shipments/<shipping_code>/checkpoints')
]

for r in resources:
    rest_api.add_resource(*r)
