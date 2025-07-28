import flask, Project, random, datetime

from flask_login import current_user
from flask_socketio import join_room, emit, disconnect
from Project.render_page import render_page
from Project.database import db
from ..models import Test, Room, Quiz
from user.models import User, Score

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
        print(f'Це тест id: {test.id}')
        print(f'Кімната: {room}')
        print(f'Це user_list: {username}')
        print(f'Це author_name: {test.author_name}')

        NEW_ROOM = Room(
            test_id= test.id,
            test_code= room,
            user_list= f'|{username}|',
            author_name= username,
            active_test= False,
            all_members= ""
        )
        db.session.add(NEW_ROOM)

    else:
        new_user = f'|{username}|'
        if new_user not in ROOM.user_list:
            ROOM.user_list += new_user
            if username != test.author_name and username not in ROOM.all_members:
                print(f"new user{username}")
                ROOM.all_members += new_user

    db.session.commit()

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
                'msg': f'{username} відключився',
                "username": f"{username}"
                }, 
            to=ROOM.test_code)
        
@Project.settings.socketio.on('test_end')
def handle_clear_test_code(data):
    room = data['room']
    ROOM = Room.query.filter_by(test_code= room).first()
    ROOM.active = 0
    TEST = Test.query.filter_by(test_code= room).first()
    TEST.test_code = 0  
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
        print(f"Користувача {username} не знайдено серед підключених.")

@Project.settings.socketio.on('get_usernames')
def handle_send_usernames(data):
    room = data['room']
    author = data['authorname']
    author_sid = get_sid(author)

    ROOM = Room.query.filter_by(test_code = room).first()

    users_in_room = ROOM.user_list.split('|')
    print(f'Это автор: {author}')
    clean_users_in_room = []
    for user in users_in_room:
        if user != author and user:
            clean_users_in_room.append(user)

    print(clean_users_in_room)
    emit("get_usernames", clean_users_in_room, room= author_sid)

@Project.settings.socketio.on('user_answers')
def handle_message(data):
    room= data["room"]
    user_name= data["username"]
    ROOM = Room.query.filter_by(test_code= room).first()
    TEST = Test.query.filter_by(id= ROOM.test_id).first()
    QUIZ_LIST = Quiz.query.filter_by(test_id= ROOM.test_id).all()

    
    user_answers = data["user_answers"].split("|")
    user_answers_list = []
    for answer in user_answers:
        if answer != "":
            user_answers_list.append(answer)
    
    number_of_correct_answers = 0
    for i in range(len(QUIZ_LIST)):
        if user_answers_list[i] == QUIZ_LIST[i].correct_answer:
            number_of_correct_answers += 1
    accuracy = number_of_correct_answers / len(QUIZ_LIST) * 100
    
    accuracy = int(accuracy)
    print(accuracy)
    print(user_answers_list)

    print(f'{data["username"]}  {data["user_answers"]}')
    
    USER = User.query.filter_by(username= user_name).first()
    
    SCORE = Score(
        user_answer= data["user_answers"],
        accuracy= accuracy,
        test_id= TEST.id,
        date_complete = datetime.date.today(),
        user_id= USER.id if USER else 0,
        user_name= user_name,
        test_code= room
    )

    db.session.add(SCORE)
    db.session.commit()

@Project.settings.socketio.on('user_answer')
def handle_message(data):
    author_name = data['author_name']
    username= data['username']
    answer= data['answer']
    
    author_sid = get_sid(author_name)

    emit("author_receive_answer", {"username": username, "answer": answer}, room= author_sid)

@Project.settings.socketio.on('get_room_size')
def handle_message(data):
    room= data["room"]
    author_name= data["author_name"]

    author_sid= get_sid(author_name)
    
    count_users = 0
    ROOM = Room.query.filter_by(test_code = room).first()
    user_str = ROOM.user_list
    
    for user in user_str.split('|'):
        if user != "":
            count_users = count_users + 1

    print(f"Кількістю людей в тесті: {count_users}")
    
    count_users = count_users - 1
    
    emit("recieve_count_users", {
        "room": room,
        "countUsers": count_users
        }
    , to= author_sid)

@Project.settings.socketio.on('author_start_test')
def handle_start_test(data):
    room = data['room']
    test= Test.query.filter_by(test_code = room).first()
    
    ROOM= Room.query.filter_by(test_code= room).first()
    ROOM.active_test= True
    db.session.commit()

    print("active_test True")
    
    emit("start_test", {
        "room": room,
        "test_id": test.id,
        "author_name": test.author_name
        }
    , to=room)

@Project.settings.socketio.on('message_to_chat')
def handle_message(data):
    emit("listening_to_messages", f"{data['username']}: {data['message']}", to= data['room'])

@Project.settings.socketio.on('new_user')
def handle_message(data):
    room= data['room']
    username= data['username']
    author_name= data["author_name"]
    user_sid = get_sid(username)

    ROOM= Room.query.filter_by(test_code= room).first()

    users_string= ROOM.user_list.replace(f"|{username}|", "")
    
    if username != author_name:
        users_string= users_string.replace(f"|{author_name}|", "")

    print("fffffffffffffffffffffffffffffffffff")
    print(users_string)

    emit("create_user_block", f"{username}", include_self= False, to= room)
    emit("create_all_user_blocks", users_string, to= user_sid)

@Project.settings.socketio.on('next_question')
def handle_message(data):
    emit("next_question", f"Next question in {data['room']} author {data['author_name']}", include_self= False, to= data['room'])

@Project.settings.socketio.on('stop_test')
def handle_message(data):
    emit("result_test", f"Stop test {data['room']} result_test page author {data['author_name']}", include_self= False, to= data['room'])


@Project.settings.socketio.on('room_get_result')
def handle_message(data):
    room_get_result_data= {}

    room= data["room"]
    user_name= data["username"]
    author_name= data["author_name"]
    user_sid= get_sid(data["username"])
    
    ROOM= Room.query.filter_by(test_code= room).first()
    TEST = Test.query.filter_by(id= ROOM.test_id).first()
    QUIZ_LIST = Quiz.query.filter_by(test_id= ROOM.test_id).all()
     
    users_list= ROOM.user_list.strip('|').split('||')
    USER_LIST= []
    SCORE_LIST= []

    for user in users_list:
        if user:
            USER= User.query.filter_by(username= user).first()
            if not USER and user != author_name:
                USER_LIST.append(user)
            elif USER.username != author_name:
                USER_LIST.append(USER)

    SCORE_LIST= Score.query.filter_by(test_code= room).all()
 
    print(USER_LIST)
    print(SCORE_LIST)

    for user in USER_LIST:
        answers_list= []
        answers_str= ""
        correct_answers_list= []

        for score in SCORE_LIST:
            try:
                if score.user_id == user.id:
                    answers_str= score.user_answer
                    break
            except:
                if score.user_name == user:
                    answers_str= score.user_answer
                    break

        answers_list= answers_str.strip('|').split('||')

        print(answers_list)

        for index, quiz in enumerate(QUIZ_LIST):
            print(quiz.correct_answer, answers_list[index])
            if quiz.correct_answer == answers_list[index]:
                correct_answers_list.append(1)
            else:
                correct_answers_list.append(0)
        try:
            room_get_result_data[user.username]= correct_answers_list
        except:
            room_get_result_data[user]= correct_answers_list

    print(room_get_result_data)

    emit("room_get_result_data", room_get_result_data, to= user_sid)

@render_page(template_name = 'room.html')
def render_room(test_code):
    list_answers = []
    list_quiz = []

    test = Test.query.filter_by(test_code= test_code).first()
    quizzes_list = Quiz.query.filter_by(test_id= test.id).all()

    for quiz in quizzes_list:
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