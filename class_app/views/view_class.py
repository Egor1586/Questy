from Project.render_page import render_page

from user.models import Classes, User
from flask_login import current_user

@render_page(template_name = 'class_page.html')
def render_class_page():

    my_classes_list= []
    classes_list= []
    classes_id= []

    user= User.query.filter_by(id= current_user.id).first()
    my_classes_list= Classes.query.filter_by(teacher_id= current_user.id).all()

    for clas in user.classes:
        classes_id.append(clas.id)

    for id in classes_id:
        classes_list.append(Classes.query.filter_by(id= id).first())
    
    return {"classes_list": classes_list,
            "my_classes_list": my_classes_list}
