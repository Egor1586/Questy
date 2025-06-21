import flask, Project, random

from flask_login import current_user
from flask_socketio import join_room, emit, disconnect
from Project.render_page import render_page
from Project.database import db
from ..models import Test, Room, Quiz
from user.models import User

users= {}

@Project.settings.socketio.on('join')
def handle_join(data):
    room= data['room']
    username= data['username']
    users[flask.request.sid] = username

    join_room(room)

    test= Test.query.filter_by(test_code = room).first()
    room= Room.query.filter_by(test_code = room).first()

    if not room:
        room = Room(
            test_id= test.id,
            test_code= room,
            user_list= f'|{username}|',
            author_name= username 
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
    
    print(f"Delete {username} from {room}")

    sid_to_kick = None
    for sid, name in users.items():
        if name == username:
            sid_to_kick = sid
            break

    if sid_to_kick:
        users.pop(sid_to_kick, None)

        emit('kicked', room=sid_to_kick)

        ROOM = Room.query.filter_by(test_code= room).first()
        print(ROOM.user_list)
        user_list = ROOM.user_list
        user_list= user_list.replace(f"|{username}|", "")
        ROOM.user_list= user_list
        print(user_list)
        db.session.commit()

        disconnect(sid=sid_to_kick)

@Project.settings.socketio.on('disconnect')
def handle_disconnect():
    username = users.pop(flask.request.sid, None)
    users.pop(flask.request.sid, None)

    if username:
        print(f"disconected {username}")

        ROOM = Room.query.filter(Room.user_list.like(f"%|{username}|%")).first()
        ROOM.user_list = ROOM.user_list.replace(f"|{username}|", "")
        db.session.commit()

        emit('user_disconnected', {
                'msg': f'{username} отключился',
                "username": f"{username}"
                }, 
            to=ROOM.test_code)

@Project.settings.socketio.on('message_to_chat')
def handle_message(data):
    emit("listening_to_messages", f"{data['username']}: {data['message']}", to= data['room'])

@Project.settings.socketio.on('new_user')
def handle_message(data):
    emit("create_user_block", f"{data['username']}", include_self= False, to= data['room'])


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
    list_answers = []
    list_quiz = []

    test = Test.query.filter_by(test_code= test_code).first()
    quizzes = Quiz.query.filter_by(test_id= test.id).all()

    for quiz in quizzes:
        list_answers.append(quiz.answer_options.split("%$№"))
        list_quiz.append(quiz.dict()) 

    test = Test.query.filter_by(test_code=test_code).first()
    ROOM = Room.query.filter_by(test_code=test_code).first()

    return {
        "test": test,
        "list_quiz": list_quiz,
        "list_answers": list_answers,
    }

def delete_code(test_id):
    test= Test.query.filter_by(id= test_id).first()
    test.test_code = 0
    Project.database.db.session.commit()

    return flask.redirect("/quizzes/")