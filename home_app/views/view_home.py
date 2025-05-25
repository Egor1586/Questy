import flask, Project

from flask_login import login_user, current_user
from Project.settings import socketio
from flask_socketio import emit, join_room
from test_app.models import Test

from Project.render_page import render_page

users = {}

@Project.settings.socketio.on('join')
def handle_join(username):
    username = username
    users[flask.request.sid] = username
    join_room(username)
    emit('user_joined', {'msg': f'{username} присоединился к комнате {username}'}, room= username)
    print(f'{username} присоединился к комнате {username}')

@Project.settings.socketio.on('message')
def handle_message(data):
    username = users.get(flask.request.sid, "Anonymous")  
    emit("message", f"{username}: {data}", broadcast=True) 
    print(f"{username}: {data}")


def loguot():
    flask.session.clear()
    return flask.redirect("/")

@render_page(template_name = 'home.html')
def render_home():
    list_test = []
    
    # if current_user.is_authenticated:
    list_test = Test.query.all()

    return {"list_tests": list_test}