from livetracking import application

@application.route('/')
def index():
    return 'Welcome to Livetracking'
