# from livetracking import socketio

# from livetracking.socket import namespaces

# NAMESPACES = [
#     (namespaces.ShipmentTrackerNamespace, '/shipment-tracker')
# ]

# for nsconfig in NAMESPACES:
#     ns, ns_name = nsconfig
#     print(ns_name)
#     socketio.on_namespace(ns(ns_name))

import livetracking.socket.eventhandler
