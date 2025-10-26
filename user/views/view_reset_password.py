import flask, Project

from .view_sing_up import user_data
from flask_login import current_user, login_user
from ..models import User
from werkzeug.security import generate_password_hash

from Project.render_page import render_page

@render_page(template_name= 'reset_password.html')
def render_reset_app():

    if flask.request.method == "POST":
        password_code= flask.session.get("password_code", " ")
        code = int(flask.request.form['code'])
        if code == password_code:
            return flask.redirect(location = '/../new_password')
    
    return { }

@render_page(template_name= 'confirm_password.html')
def render_confirm_account():
    if flask.request.method == "POST":
        sing_up_code= flask.session.get("sing_up_code", " ")
        code = int(flask.request.form['code'])
        if code == sing_up_code:
                
            user = User(
                username = user_data['name'],
                email = user_data["email"],
                password = generate_password_hash(user_data['password']),
                is_teacher = bool(user_data['is_teacher'])
            )                   
            
            
            
            Project.db.session.add(user)
            Project.db.session.commit()

            login_user(user)

            return flask.redirect(location = '/../')
    
    if not current_user.is_authenticated:
        return { }
    else:
        return flask.redirect('/')




