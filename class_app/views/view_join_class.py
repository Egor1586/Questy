import flask

from Project.render_page import render_page
from user.models import Classes
from flask_login import current_user
from Project.database import db

@render_page(template_name = 'join_class.html')
def render_join_class():
    if flask.request.method == 'POST':
        code = flask.request.form.get('code')
        CLASS = Classes.query.filter_by(class_code = code).first()

        if current_user not in CLASS.users and current_user.id is not CLASS.teacher_id:
            CLASS.users.append(current_user)
            db.session.commit()

            return flask.redirect(location = '/class_page')

    return {}