import flask, json

from datetime import datetime, date, timedelta

from Project.render_page import render_page
from user.models import Classes, Score, User
from datetime import datetime
from flask_login import current_user

def allCoursesData(user):
    cur_week_task_list = []
    next_week_task_list = []
    duetime_task_list = []
    overdue_task_list = []

    for CLASS in user.classes:
        day_today= datetime.now().date()

        start_of_week = day_today - timedelta(days=day_today.weekday())     
        end_of_week = start_of_week + timedelta(days=6)             

        today = datetime.now()

        for task in CLASS.tasks:
            try:
                due_time = task.due_time

                if not due_time:
                    duetime_task_list.append(task.dict())

                    continue

                if due_time < today:
                    overdue_task_list.append(task.dict())
                elif start_of_week <= due_time.date() <= end_of_week:
                    cur_week_task_list.append(task.dict())
                elif end_of_week < due_time.date() <= end_of_week + timedelta(days= 7):
                    next_week_task_list.append(task.dict())
                else:
                    if task.work_after_time:
                        duetime_task_list.append(task.dict())
                    else:
                        overdue_task_list.append(task.dict())
            except Exception as error:
                print(error)
                continue

    return cur_week_task_list, next_week_task_list, duetime_task_list, overdue_task_list

@render_page(template_name = 'task_page.html')
def render_task_page():
    
    USER= User.query.filter_by(id= current_user.id).first()
    cur_week_task_list, next_week_task_list, duetime_task_list, overdue_task_list = allCoursesData(USER)

    return {"classes": USER.classes,
            "cur_week_task_list": cur_week_task_list,
            "next_week_task_list": next_week_task_list,
            "duetime_task_list": duetime_task_list,
            "overdue_task_list": overdue_task_list}


def sorte_task():

    data = flask.request.get_json()

    USER= User.query.filter_by(id= current_user.id).first()
    cur_week_task_list, next_week_task_list, duetime_task_list, overdue_task_list = allCoursesData(USER)

    tasks= []
    classes_dict= []

    for clas in USER.classes:
        classes_dict.append(clas.dict())
    if data['sortytype'] == "all":
        return json.dumps({ "sorty_type": "all",
                           "classes": classes_dict,
                            "cur_week_task_list": cur_week_task_list,
                            "next_week_task_list": next_week_task_list,
                            "duetime_task_list": duetime_task_list,
                            "overdue_task_list": overdue_task_list})
    else:
        class_id = int(data['sortytype'])
        CLASS = Classes.query.filter_by(id= class_id).first()


        class_dict = CLASS.dict()

        for task in CLASS.tasks:
            tasks.append(task.dict())
    
        return json.dumps({ "sorty_type": "class",
                            "class": class_dict,
                            "task_list": tasks})