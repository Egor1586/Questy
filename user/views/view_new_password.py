import flask, Project
from ..models import User

from Project.render_page import render_page
from werkzeug.security import generate_password_hash

@render_page(template_name= 'new_password.html')
def render_new_password():
    if flask.request.method == "POST":
        new_password = flask.request.form['new_pas']
        conf_password = flask.request.form['new_pas_conf']

        email= flask.session.get("email", " ")

        for user in User.query.filter_by(email = email):
            if user and new_password == conf_password:
                user.password = generate_password_hash(new_password)
                Project.db.session.commit()
                
                return flask.redirect(location = '/../login')
    
    return { }