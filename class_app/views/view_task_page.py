from Project.render_page import render_page

from user.models import Classes, Score, User
from datetime import datetime
from flask_login import current_user

@render_page(template_name = 'task_page.html')
def render_task_page():
    
    USER= User.query.filter_by(id= current_user.id).first()

    do_task_all= []
    due_time_list_all= []
    can_do_task_all= []

    for CLASS in USER.classes:
        do_task= []
        due_time_list= []
        can_do_task= []
        for task in CLASS.tasks:
            due_time_list.append([str(task.due_time)[0:10], str(task.due_time)[11:16]])

        date_time_now= str(datetime.now())
        date_now= date_time_now[0:10]
        time_now= date_time_now[11:16]

        date_now_list= date_now.split("-")
        time_now_list= time_now.split(":")
        
        task_date_now_list= []
        task_time_now_list= []
        for index, due in enumerate(due_time_list):
            task= CLASS.tasks[index]
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

        do_task_all.append(do_task)
        due_time_list_all.append(due_time_list)
        can_do_task_all.append(can_do_task)

    print(do_task_all)
    print(due_time_list_all)
    print(can_do_task_all)

    return { }