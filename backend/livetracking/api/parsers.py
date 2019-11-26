from flask_restful import reqparse

shipment_parser = reqparse.RequestParser()
shipment_parser.add_argument('inventory_code')
shipment_parser.add_argument('start_name')
shipment_parser.add_argument('start_lat')
shipment_parser.add_argument('start_lng')
shipment_parser.add_argument('destination_name')
shipment_parser.add_argument('destination_lat')
shipment_parser.add_argument('destination_lng')

checkpoint_parser = reqparse.RequestParser()
checkpoint_parser.add_argument('location_name')
checkpoint_parser.add_argument('location_lat')
checkpoint_parser.add_argument('location_lng')
