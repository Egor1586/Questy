from datetime import datetime

from Project.render_page import render_page

from user.models import Classes, Score
from flask_login import current_user

@render_page(template_name = 'courses.html')
def render_class_courses(id):

    do_task= []
    due_time_list= []
    can_do_task= []

    CLASS= Classes.query.filter_by(id= id).first()  
    taskes_list= CLASS.tasks

    for task in taskes_list:
        if task.due_time:
            due_time_list.append([str(task.due_time)[0:10], str(task.due_time)[11:16]])
        else:
            due_time_list.append([None, None])

    date_time_now= str(datetime.now())
    date_now= date_time_now[0:10]
    time_now= date_time_now[11:16]

    date_now_list= date_now.split("-")
    time_now_list= time_now.split(":")
    print("TIME AND DATE NOW")
    print(date_now, time_now)
    print(date_now_list, time_now_list)
    
    task_date_now_list= []
    task_time_now_list= []
    for index, due in enumerate(due_time_list):
        task= taskes_list[index]

        if due[0] == None:
            can_do_task.append(1)
            continue

        task_date_now_list= due[0].split("-")
        task_time_now_list= due[1].split(":")


        if task.work_after_time:
            can_do_task.append(1)
        elif int(task_date_now_list[0]) > int(date_now_list[0]) and int(task_date_now_list[1]) > int(date_now_list[1]) and int(task_date_now_list[2]) > int(date_now_list[2]) and int(task_time_now_list[0]) > int(time_now_list[0]) and int(task_time_now_list[1]) > int(time_now_list[1]):
            can_do_task.append(1)
        else:
            can_do_task.append(0)

    for task in CLASS.tasks:
        score= Score.query.filter_by(test_id= task.test_id, class_id= CLASS.id, user_id= current_user.id).first()
        if score:
            do_task.append(1)
        else:
            do_task.append(0)

    return {"class": CLASS,
            "taskes_list": taskes_list,
            "do_task": do_task,
            "due_time_list": due_time_list,
            "can_do_task": can_do_task}