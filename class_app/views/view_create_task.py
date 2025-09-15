import flask

from Project.render_page import render_page
from Project.database import db
from flask_login import current_user
from user.models import Task
from test_app.models import Test
from datetime import datetime


@render_page(template_name = 'create_task.html')
def render_create_task(id):

    test_list= Test.query.filter_by(author_name= current_user.username).all()

    filter_test_list= []
    for test in test_list:
        task_in_class= Task.query.filter_by(test_id= test.id, class_id= id).first()
        if not task_in_class:
            filter_test_list.append(test)

    test_list= filter_test_list

    if flask.request.method == "POST":   
        try:
            title = flask.request.form['title']
            description = flask.request.form['description']
            test_id = flask.request.form['choice_test']
            due_time= flask.request.form['due-time']
            done_after_due_time= flask.request.form.get('done-after-due-time')

            print(done_after_due_time)

            print("True") if done_after_due_time == "on" else print("False")
            
            TASK = Task(
                title= title,
                description= description,
                class_id = id,
                test_id= test_id,
                due_time= datetime.strptime(due_time, "%Y-%m-%dT%H:%M"),
                work_after_time= True if done_after_due_time == "on" else False
            )

            db.session.add(TASK)
            db.session.commit()

            return flask.redirect(location = '/class_page')

        except Exception as error:
            print(error)

    return {"test_list": test_list}
