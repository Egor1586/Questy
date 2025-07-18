import flask

from flask_login import current_user
from Project.render_page import render_page
from Project.clear_cookie import clear_cookies

@render_page(template_name='temporary_name.html')
def render_temporary_name(code):
    
    
    return {}