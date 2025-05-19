import flask
from functools import wraps

from flask_login import current_user

def render_page(template_name: str):
    def config_page(function: str):
        @wraps(function)
        def handler(*args, **kwargs):
            context= function(*args, **kwargs)
            return flask.render_template(
                template_name_or_list = template_name,
                is_authorization = current_user.is_authenticated,
                username = current_user.username if current_user.is_authenticated else "", 
                is_teacher= current_user.is_teacher if current_user.is_authenticated else "",
                is_admin = current_user.is_admin if current_user.is_authenticated else "",
                **context
            )
        return handler
    return config_page

