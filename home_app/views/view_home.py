import flask, Project

from flask_login import login_user, current_user
from Project.settings import socketio
from flask_socketio import emit, join_room
from test_app.models import Test

from Project.render_page import render_page

users = {}

@Project.settings.socketio.on('join')
def handle_join(code):

    users_id = []
    test = Test.query.filter_by(test_code = code).first()


    users[flask.request.sid] = current_user.username
    username=  users.get(flask.request.sid, "Anonymous") 
    
    join_room(code)


    if current_user.id not in users_id:
        users_id.append(current_user.id)
    print(users_id)

    if current_user.username == test.author_name:
        id_string = ""
        for u_id in users_id:
            if id_string:
                id_string += "|"
            id_string += str(u_id)

        print(id_string)
        response = flask.make_response(flask.redirect(f'/'))
        response.set_cookie(key='users_id', value=id_string)

    emit('user_joined', {'msg': f'{username} присоединился к комнате {code}'}, room= code)
    emit('', {'cookie': f'{response}'})
    print(f'{username} присоединился к комнате {code}', room = code)

@Project.settings.socketio.on('')
def handle_cookie(code):
    pass

@Project.settings.socketio.on('message')
def handle_message(data):
    username = users.get(flask.request.sid, "Anonymous")  
    emit("message", f"{current_user.username}: {data}", broadcast=True) 
    print(f"{current_user.username}: {data}")

def loguot():
    flask.session.clear()
    return flask.redirect("/")

@render_page(template_name = 'home.html')
def render_home():
    list_test = Test.query.all()
    code_list = []

    for test in list_test:
        if test.test_code != 0:
            code_list.append(str(test.test_code))

    code_str = " ".join(code_list)

    print(code_str)

    return {
        "list_tests": list_test,
        "code_str": code_str
    }