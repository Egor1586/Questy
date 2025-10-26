import flask

from flask_login import current_user, login_user
from ..models import User, UnconfirmedUser

from Project.render_page import render_page
from Project.database import db

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
        sign_up_email= flask.session.get("sign_up_email", " ")
        code = int(flask.request.form['code'])

        ucconfirmed_user= UnconfirmedUser.query.filter_by(email = sign_up_email).first()
        
        if ucconfirmed_user and code == int(ucconfirmed_user.code):
            user = User(
                username = ucconfirmed_user.username,
                email = ucconfirmed_user.email,
                password = ucconfirmed_user.password,
                is_teacher = ucconfirmed_user.is_teacher
            )   

            db.session.add(user)

        db.session.delete(ucconfirmed_user)
        db.session.commit()

        if ucconfirmed_user and code == int(ucconfirmed_user.code):
            login_user(user)

        return flask.redirect(location = '/../')
    
    if not current_user.is_authenticated:
        return { }
    else:
        return flask.redirect('/')




