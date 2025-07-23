import flask

from user.models import User
from Project.database import db

from flask_login import current_user

from Project.render_page import render_page

@render_page(template_name = 'edit_profile.html')
def render_edit_profile(user_id):
    
    user = User.query.filter_by(id= user_id).first()

    if flask.request.method == "POST":
        if flask.request.form["name"]:
            user.username = flask.request.form["name"]
            return flask.redirect("/profile")

    db.session.commit()
    
    return { }