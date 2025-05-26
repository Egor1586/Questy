import flask
import random 

from Project.settings import project
from ..send_email import send_code

from Project.render_page import render_page

@render_page(template_name = 'send_email.html')
def render_send_email():

    if flask.request.method == 'POST':

        email = flask.request.form['email'] 
        code = random.randint(100000, 999999)
        flask.session["password_code"]= code
        flask.session["email"]= email

        with project.app_context():
            send_code(user_email= email, code= code)
        
        return flask.redirect(location = '/../reset_password')
    
    return { }