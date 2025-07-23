import flask

from user.models import User

from flask_login import current_user

from Project.render_page import render_page

@render_page(template_name = 'profile.html')
def render_profile():
    
    user = User.query.filter_by(id= current_user.id)


    return { "user": user}

