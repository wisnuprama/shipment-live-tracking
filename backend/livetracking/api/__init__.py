from livetracking import rest_api
from livetracking.api import views

resources = [
    (views.ShipmentListCreate, '/shipments'),
    (views.ShipmentDetail, '/shipments/<shipping_code>'),
    (views.CheckpointListCreate, '/shipments/<shipping_code>/checkpoints'),
    (views.LocationLogListCreate, '/shipments/<shipping_code>/locations')
]

for r in resources:
    rest_api.add_resource(*r)
