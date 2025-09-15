from Project.render_page import render_page

from user.models import Classes, Score
from flask_login import current_user

@render_page(template_name = 'task_page.html')
def render_task_page():

    return { }