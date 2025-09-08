from Project.render_page import render_page

from user.models import Classes, Score
from flask_login import current_user

@render_page(template_name = 'courses.html')
def render_class_courses(id):

    do_task= []

    CLASS= Classes.query.filter_by(id= id).first()  
    taskes_list= CLASS.tasks

    for task in CLASS.tasks:
        score= Score.query.filter_by(task_test_id= task.id, user_id= current_user.id).first()
        if score:
            do_task.append(1)
        else:
            do_task.append(0)

    return {"class": CLASS,
            "taskes_list": taskes_list,
            "do_task": do_task}