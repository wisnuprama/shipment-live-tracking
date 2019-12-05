import os

BASE_DIR = os.path.join(os.path.join(os.path.dirname(os.path.dirname(
    os.path.abspath(os.path.dirname(__file__)))), 'backend'), 'livetracking')

# config
SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'hehehe')
IS_DEVELOPMENT = os.getenv('FLASK_ENV', 'development') == 'development'

# web server
HOST = '0.0.0.0'

# datasource
if IS_DEVELOPMENT:
    DATABASE = {
        'keyspace': {
            'name': 'livetracking',
            'replication_factor': 1,
        },
        'config': {
            'default_keyspace': 'livetracking',
            'hosts': ['localhost', ],
            'retry_connect': True,
            'port': 9042
        }
    }
else:
    DATABASE = {
        'keyspace': {
            'name': 'livetracking',
            'replication_factor': 2,
        },
        'config': {
            'default_keyspace': 'livetracking',
            'hosts': ['172.21.128.3', '172.21.128.4'],
            'retry_connect': True,
            'port': 9042
        }
    }

TEMPLATES_DIR = os.path.join(os.path.join(BASE_DIR, 'web'), 'templates')
