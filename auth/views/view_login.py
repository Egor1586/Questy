import flask

from flask_login import login_user, current_user
from ..models import User

from Project.render_page import render_page

@render_page(template_name = 'login.html')
def render_login_app():
    if flask.request.method == "POST":
        password = flask.request.form["password"]
        email = flask.request.form["email"]
        
        user = User.query.filter_by(email=email).first()

        if user.email == email and user.password == password: 
            login_user(user)
                
    if not current_user.is_authenticated:
        return { }
    else:
        return flask.redirect('/')
