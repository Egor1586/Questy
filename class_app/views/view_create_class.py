import flask, random, datetime, string

from flask_login import current_user
from Project.database import db
from user.models import Classes

from Project.render_page import render_page

def generate_code(length):
  characters = string.ascii_letters + string.digits
  code = ''.join(random.choice(characters) for i in range(length))
  return code

@render_page(template_name = 'create_class.html')
def render_create_class():
    try:
        if flask.request.method == "POST":   
            title = flask.request.form['title']
            description = flask.request.form['description']
            color = flask.request.form['color']
            
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
                class_color= color
            )

            db.session.add(CLASS)
            db.session.commit()

            return flask.redirect(location = '/class_page')

    except Exception as error:
        print(error)

    return { }