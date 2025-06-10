import flask, Project

from flask_login import login_user, current_user
from Project.settings import socketio
from flask_socketio import emit, join_room
from test_app.models import Test
from .view_quizzes import users
from Project.render_page import render_page

@Project.settings.socketio.on('join')
def handle_join(code):
    users[flask.request.sid] = current_user.username
    join_room(code)

    emit('user_joined', {'msg': f'{current_user.username} присоединился к комнате {code}'}, room= code)

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