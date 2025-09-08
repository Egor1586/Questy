import flask

from Project.render_page import render_page
from Project.database import db
from user.models import Task


@render_page(template_name = 'create_task.html')
def render_create_task(id):
    try:
        if flask.request.method == "POST":   
            title = flask.request.form['title']
            description = flask.request.form['description']
            
            TASK = Task(
                title= title,
                description= description,
                class_id = id,
                test_id= 1,
            )

            db.session.add(TASK)
            db.session.commit()

            return flask.redirect(location = '/class_page')

    except Exception as error:
        print(error)

    return { }
