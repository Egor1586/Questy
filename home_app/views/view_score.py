import flask

from flask_login import current_user

from Project.render_page import render_page

@render_page(template_name = 'score.html')
def render_score():
    return { }