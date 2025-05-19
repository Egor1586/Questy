import flask, Project

from flask_login import current_user
from flask_socketio import join_room, emit
from Project.render_page import render_page

users = {}

@Project.settings.socketio.on('join')
def handle_join(username):
    username = username
    users[flask.request.sid] = username
    join_room(username)
    emit('user_joined', {'msg': f'{username} присоединился к комнате {username}'}, room= username)

@Project.settings.socketio.on('message')
def handle_message(data):
    username = users.get(flask.request.sid, "Anonymous") 
    emit("message", f"{username}: {data}", broadcast=True)

@render_page(template_name = 'room.html')
def render_room(test_code):

    return {
    "CODE": test_code
    }
