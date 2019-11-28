from flask import render_template
from livetracking import application


@application.route('/')
def index():
    return 'Welcome to Livetracking'

@application.route('/test')
def test():
    return render_template('test.html')
