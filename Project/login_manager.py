import flask_login, user

from .settings import project

login_manager = flask_login.LoginManager(app= project)

@login_manager.user_loader
def load_user(id):
    return user.User.query.get(id)
