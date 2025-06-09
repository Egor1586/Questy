import flask, Project, random

from flask_login import current_user
from flask_socketio import join_room, emit
from Project.render_page import render_page
from ..models import Test

users = {}

# @Project.settings.socketio.on('join')
# def handle_join(code):
#     users[flask.request.sid] = current_user.username
#     join_room(code)

#     emit('user_joined', {'msg': f'{current_user.username} присоединился к комнате {code}'}, room= code)

@Project.settings.socketio.on('message')
def handle_message(data):
    username = users.get(flask.request.sid, "Anonymous") 
    emit("message", f"{username}: {data}", broadcast=True)

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
    
