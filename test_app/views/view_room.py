import flask, Project, random

from flask_login import current_user
from flask_socketio import join_room, emit, leave_room
from Project.render_page import render_page
from ..models import Test

users= {}

@Project.settings.socketio.on('join')
def handle_join(data):
    code= data['code']
    username= data['username']
    users[flask.request.sid] = username

    join_room(code)
    emit('user_joined', {'msg': f'{username} присоединился к комнате {code}'}, room= code)

@Project.settings.socketio.on('kick_user')
def handle_kick_user(data):
    user = data['kick_user']
    room = data['room']

    print(f"Delete {user} from {room}")

@Project.settings.socketio.on('message_to_chat')
def handle_message(data):
    room = data['room']
    emit("listening_to_messages", f"{data['username']}: {data['message']}", broadcast=True, to=room)

@Project.settings.socketio.on('disconnect')
def handle_disconnect():
    if flask.request.sid in users:
        users.pop(flask.request.sid)


@Project.settings.socketio.on('start_test')
def handle_start_test():
    
    print("start")


@render_page(template_name = 'room.html')
def render_room(test_code):

    list_users = ["user1", "user2", "user3"]
    
    test= Test.query.filter_by(test_code= test_code).first()
    

    return {
        "test": test,
        "list_users": list_users
        }

def delete_code(test_id):
    test= Test.query.filter_by(id= test_id).first()
    test.test_code = 0
    Project.database.db.session.commit()

    return flask.redirect("/quizzes/")
    
