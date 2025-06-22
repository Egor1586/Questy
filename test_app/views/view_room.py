import flask, Project, random

from flask_login import current_user
from flask_socketio import join_room, emit, disconnect
from Project.render_page import render_page
from Project.database import db
from ..models import Test, Room, Quiz
from user.models import User

users= {}

def get_sid(username):
    for sid, name in users.items():
        if name == username:
            return sid
    
    return None

@Project.settings.socketio.on('join')
def handle_join(data):
    room= data['room']
    username= data['username']
    users[flask.request.sid] = username

    join_room(room)

    test= Test.query.filter_by(test_code = room).first()
    ROOM= Room.query.filter_by(test_code = room).first()

    if not ROOM:
        print(f'Это тест айди: {test.id}')
        print(f'Это комната: {room}')
        print(f'Это user_list: {username}')
        print(f'Это author_name: {test.author_name}')

        NEW_ROOM = Room(
            test_id= test.id,
            test_code= room,
            user_list= f'|{username}|',
            author_name= username 
        )
        db.session.add(NEW_ROOM)

    else:
        new_user = f'|{username}|'
        if new_user not in ROOM.user_list:
            ROOM.user_list += new_user

    db.session.commit()


@Project.settings.socketio.on('kick_user')
def handle_kick_user(data):
    username = data['user']
    room = data['room']
    
  
    kick_sid = get_sid(username)

    if kick_sid:
        users.pop(kick_sid, None)
        emit('kicked', room= kick_sid)
        ROOM = Room.query.filter_by(test_code=room).first()
        ROOM.user_list = ROOM.user_list.replace(f"|{username}|", "")
        db.session.commit()
        
        disconnect(sid= kick_sid)
    else:
        print(f"Пользователь {username} не найден среди подключённых.")

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

# @Project.settings.socketio.on('next_question')
# def handle_message(data):
#     emit("create_user_block", f"{data['username']}", include_self= False, to= data['room'])

@Project.settings.socketio.on('user_answer')
def handle_message(data):
    author_name = data['author_name']

    author_sid = get_sid(author_name)

    print(data["msg"])

    if author_sid:
        emit("author_receive_answer", data["msg"], room= author_sid)
    else:
        print(f"Нет {author_name} в users")

@Project.settings.socketio.on('get_room_size')
def handle_message(data):
    room= data["room"]
    author_name= data["author_name"]

    author_sid= get_sid(author_name)

    users_in_room = []
    count_users = 0
    ROOM = Room.query.filter_by(test_code = room).first()
    user_str = ROOM.user_list
    users_in_room.append(user_str.split('|'))
    for user in users_in_room:
        if user != "":
            count_users =+ 1
    
    print(count_users)
    
    emit("recieve_count_users", {
        "room": room,
        "countUsers": count_users
        }
    , to=author_sid)

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

    test = Test.query.filter_by(test_code= test_code).first()
    print(test.test_code)

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