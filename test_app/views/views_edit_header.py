import flask
from ..models import Test

from Project.database import db

from flask_login import current_user

def render_edit_header(test_id):

    test= Test.query.filter_by(id= test_id).first()

    if flask.request.method == "POST":

        if flask.request.form["title"]:
            title = flask.request.form["title"]
            test.title= title

        if flask.request.form["description"]:
            description = flask.request.form["description"]
            test.description= description

        db.session.commit()

        return flask.redirect(f"/test_app{test.test_code}?test_id= {test.id}")

    return flask.render_template(
        template_name_or_list = 'edit_head_test.html',
        is_authorization = current_user.is_authenticated,
        username = current_user.username if current_user.is_authenticated else "", 
        is_teacher= current_user.is_teacher if current_user.is_authenticated else ""
    )