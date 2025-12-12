import os, secrets, dotenv
from flask import Flask, render_template, request
from flask_wtf import FlaskForm, CSRFProtect
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from flask_mail import Mail
from flask_socketio import SocketIO
from flask_wtf.csrf import generate_csrf

dotenv.load_dotenv()
GOOGLE_APP_KEY = os.getenv("GOOGLE_APP_KEY")

project = Flask(
    __name__,
    static_folder="static",
    static_url_path="/Project/",
    template_folder="templates",
    instance_path=os.path.abspath(os.path.join(__file__, '..', 'instance'))
)

project.config.update(
    SECRET_KEY=secrets.token_hex(16), 
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USE_SSL=False,
    MAIL_USERNAME='egor115819@gmail.com',
    MAIL_PASSWORD=GOOGLE_APP_KEY,
)


mail = Mail(project)
socketio = SocketIO(project, cors_allowed_origins="*")
csrf = CSRFProtect(project)

class MyForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    submit = SubmitField('Submit')


@project.route('/', methods=['GET', 'POST'])
def index():
    form = MyForm()
    context = {
        'form': form,
        'is_authorization': True,
        'is_teacher': False,
        'username': 'TestUser'
    }
    return render_template('base.html', **context)

@project.route('/get_csrf', methods=['GET'])
def get_csrf():
    token = generate_csrf()
    return {"csrf_token": token}


@project.route('/submit', methods=['POST'])
def submit():
    data = request.form.get('data', '')
    return f"Received: {data}"
