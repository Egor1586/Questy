import flask
from ..models import Test, Quiz

from flask_login import current_user
from Project.render_page import render_page

@render_page(template_name = 'create_test.html')
def render_create_test():

    return {}