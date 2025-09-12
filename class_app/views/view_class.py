import flask, string, random, datetime

from Project.render_page import render_page
from user.models import Classes, User
from flask_login import current_user
from Project.database import db

def generate_code(length):
  characters = string.ascii_letters + string.digits
  code = ''.join(random.choice(characters) for i in range(length))
  return code

@render_page(template_name = 'class_page.html')
def render_class_page():
    if flask.request.method == "POST":   
        try:
            title = flask.request.form['title']
            description = flask.request.form['lesson']
            color_g1= ""
            color_g2= ""
            
            try:
                color_g1 = flask.request.form['color-m']
                color_g2= None
            except Exception as error:
                color_g1 = flask.request.form['color-g1']
                color_g2 = flask.request.form['color-g2']
            
            max_count= flask.request.form['max-count']
            
            while True: 
                code = generate_code(7)
                db_class_code = Classes.query.filter_by(class_code= code).first()
                
                if db_class_code is None:
                    break
            
            CLASS = Classes(
                title= title,
                description= description,
                class_code = code,
                teacher_id = current_user.id,
                created_date= datetime.date.today(),
                class_color1= color_g1,
                class_color2= color_g2,
                max_user_count= max_count
            )

            db.session.add(CLASS)
            db.session.commit()

            return flask.redirect(location = '/class_page')

        except Exception as error:
            if flask.request.method == 'POST':
                code = flask.request.form.get('code')
                CLASS = Classes.query.filter_by(class_code = code).first()

                if current_user not in CLASS.users and current_user.id is not CLASS.teacher_id and len(CLASS.users) < CLASS.max_user_count:
                    CLASS.users.append(current_user)
                    db.session.commit()

                    return flask.redirect(location = '/class_page')

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
