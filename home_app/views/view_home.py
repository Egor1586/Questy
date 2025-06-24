import flask, Project

from test_app.models import Room, Test
from Project.render_page import render_page
from flask import jsonify

def loguot():
    flask.session.clear()
    return flask.redirect("/")

def get_codes():
    list_room = Room.query.all()
    code_list = []

    for room in list_room:
        if room.test_code != 0 and not room.active_test:
            code_list.append(str(room.test_code))

    print(code_list)
    
    return jsonify(code_list)

@render_page(template_name = 'home.html')
def render_home():
    list_room = Room.query.all()
    list_tests= Test.query.all()
    code_list = []

    for room in list_room:
        if room.test_code != 0 and not room.active_test:
            code_list.append(str(room.test_code))

    code_str = " ".join(code_list)

    print(code_str)

    return {
        "list_room": list_room,
        "list_tests": list_tests,
        "code_str": code_str
    }

