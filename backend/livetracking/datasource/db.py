from livetracking import settings
from livetracking.datasource import models

from cassandra.cqlengine import connection
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.management import create_keyspace_simple
from cassandra.cqlengine.management import create_keyspace_network_topology

MODELS = [
    models.Shipment,
    models.Checkpoint,
    models.LocationLog
]

def build():
    # setup connection
    connection.setup(protocol_version=3, **settings.DATABASE['config'])
    # create keyspace, because we only have 2 nodes in 1 datacenter
    # then we use simple strategy
    create_keyspace_simple(**settings.DATABASE['keyspace'])

    # sync each model
    # if you alter field, this mechanism
    # wont sync your changes.
    for model in MODELS:
        sync_table(model)

build()
