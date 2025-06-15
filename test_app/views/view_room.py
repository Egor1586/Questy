import flask, Project, random

from flask_login import current_user
from flask_socketio import join_room, emit, disconnect
from Project.render_page import render_page
from Project.database import db
from ..models import Test, Room
from user.models import User

users= {}

@Project.settings.socketio.on('join')
def handle_join(data):
    code= data['code']
    username= data['username']
    users[flask.request.sid] = username

    join_room(code)
    emit('user_joined', {'msg': f'{username} присоединился к комнате {code}'}, room= code)

    test= Test.query.filter_by(test_code = code).first()
    room= Room.query.filter_by(test_code = code).first()

    if not room:
        room = Room(
            test_id=test.id,
            test_code=code,
            user_list=f'|{username}|',
            author_name = username 
        )
        db.session.add(room)

    else:
        new_user = f'|{username}|'
        if new_user not in room.user_list:
            room.user_list += new_user

    db.session.commit()


@Project.settings.socketio.on('kick_user')
def handle_kick_user(data):
    username = data['user']
    room = data['room']
    type = data['type']
    
    print(f"Delete {username} from {room}")

    sid_to_kick = None
    for sid, name in users.items():
        if name == username:
            sid_to_kick = sid
            break

    if sid_to_kick:
        users.pop(sid_to_kick, None)

        if type == "kick_user":
            emit('kicked', room=sid_to_kick)

        ROOM = Room.query.filter_by(test_code= room).first()
        print(ROOM.user_list)
        user_list = ROOM.user_list
        user_list= user_list.replace(f"|{username}|", "")
        ROOM.user_list= user_list
        print(user_list)
        db.session.commit()

        if type == "kick_user":
            disconnect(sid=sid_to_kick)


@Project.settings.socketio.on('message_to_chat')
def handle_message(data):
    room = data['room']
    emit("listening_to_messages", f"{data['username']}: {data['message']}", broadcast=True, to=room)


@Project.settings.socketio.on('author_start_test')
def handle_start_test(data):
    room = data['room']
    test= Test.query.filter_by(test_code = room).first()
    
    emit("start_test", {
        "room": room,
        "test_id": test.id,
        "author_name": test.author_name
        }
    , to=room)


@render_page(template_name = 'room.html')
def render_room(test_code):

    list_users = ["Егор", "Денис", "USER1", "USER2"] 

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