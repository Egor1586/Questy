import flask, Project, random
from flask_login import current_user
from test_app.models import Test, Room
from user.models import Task

from Project.database import db
from Project.render_page import render_page
from flask_socketio import emit, join_room

@render_page(template_name = 'quizzes.html')
def render_quizzes():
    start_button= []
    
    list_tests = Test.query.filter_by(author_name= current_user.username).all()
    count_of_tests = int(len(list_tests))

    for test in list_tests:
        ROOM = Room.query.filter_by(test_code = test.test_code).first()
        if ROOM:
            start_button.append(1)
        else:
            start_button.append(0)
    
    return{
    "list_tests": list_tests,
    "start_button": start_button,
    "count_of_tests": count_of_tests
    }

def created_test(test_id):
    test= Test.query.filter_by(id= test_id).first()

    while True:
        code = random.randint(1000, 9999)
        room_code = Room.query.filter_by(test_code= code).first()
        if room_code == None:
            break
    test.test_code= code
    Project.database.db.session.commit()

    last_page= flask.request.referrer
    return flask.redirect(last_page or "/")
    

def delete_test(test_id):
    test = Test.query.filter_by(id = test_id).first()
    task_list = Task.query.filter_by(test_id = test_id).all()
    if current_user.username ==  test.author_name:
        for task in task_list:
            db.session.delete(task)
        
        db.session.delete(test)
        
    db.session.commit()

    last_page= flask.request.referrer
    return flask.redirect(last_page or "/")

def reset_test(test_id):
    test = Test.query.filter_by(id = test_id).first()
    test.test_code = 0
    db.session.commit()

    last_page= flask.request.referrer
    return flask.redirect(last_page or "/")