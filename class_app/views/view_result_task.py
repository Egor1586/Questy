import flask

from Project.render_page import render_page
from user.models import Classes, Score, Task

@render_page(template_name = 'result_task.html')
def render_result_task():
    undo_user_list=[]
    do_user_list= []
    do_score_list= []
    
    class_id= flask.request.args.get("class_id")
    task_id= flask.request.args.get("task_id")

    CLASS= Classes.query.filter_by(id= class_id).first()
    TASK= Task.query.filter_by(id= task_id).first()

    for user in CLASS.users:
        score= Score.query.filter_by(test_id= TASK.test_id, class_id= CLASS.id, user_id= user.id).first()
        if score:
            do_user_list.append(user)
            do_score_list.append(score)
        else:
            undo_user_list.append(user)

    print(do_user_list)
    print(do_score_list)
    print(undo_user_list)

    return {"do_user_list": do_user_list,
            "do_score_list": do_score_list,
            "undo_user_list": undo_user_list,
            "class": CLASS}
