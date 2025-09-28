import flask, traceback, random
import Project

from ..models import User
from flask_login import current_user
from ..send_email import send_code

from Project.render_page import render_page

user_data = {
    "name": None,
    'password': None,
    'password_confirmation': None,
    'email': None,
    'is_teacher': None
    }

@render_page(template_name= 'sign_up.html')
def render_sign_up(): 
       
    if flask.request.method == 'POST':
        try:   
            user_data["name"] = flask.request.form['name'].strip()
            user_data["password"]= flask.request.form['password'] 
            user_data["password_confirmation"]= flask.request.form['password-confirmation']
            user_data["email"]= flask.request.form['email']
            role = flask.request.form['is_teacher']
            if role == "False":
                user_data['is_teacher'] = False
            else:
                user_data['is_teacher'] = True
       
            code= random.randint(100000, 999999)
            sing_up_code= flask.session["sing_up_code"]= code

            db_email = User.query.filter_by(email = user_data["email"]).first()
            
            if user_data["password"] == user_data["password_confirmation"]: 
                if db_email is None:

                    print(sing_up_code)
                    # with Project.project.app_context():
                    #     send_code(user_email=user_data["email"], code= sing_up_code, type= "confirm")

                    return flask.redirect(location = '/confirmation_account')

            else:
                print('Not same password')

                
        except Exception as e:
            print(e)
            traceback.print_exc()
    
    return { }