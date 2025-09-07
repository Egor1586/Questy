import flask

from Project.render_page import render_page
from ..models import Classes

@render_page(template_name = 'join_class.html')
def render_join_class():
    if flask.request.method == 'POST':
        code = flask.request.form.get('code')
        print(code)
        CLASS = Classes.query.filter_by(class_code = code).first()
        print(CLASS)
    return {}