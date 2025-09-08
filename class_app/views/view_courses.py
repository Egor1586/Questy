from Project.render_page import render_page

from user.models import Classes, Task

@render_page(template_name = 'courses.html')
def render_class_courses(id):

    print(id)

    CLASS= Classes.query.filter_by(id= id).first()
    taskes_list= CLASS.tasks

    return {"class": CLASS,
            "taskes_list": taskes_list}