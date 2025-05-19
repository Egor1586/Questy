import flask

from flask_login import current_user

from Project.render_page import render_page

@render_page(template_name = 'profile.html')
def render_profile():
    
    return { }

