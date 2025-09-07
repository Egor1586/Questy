from flask_login import UserMixin
from Project.database import db

class User(db.Model, UserMixin):

    id = db.Column(db.Integer, primary_key= True)
    username = db.Column(db.String(20), nullable= False)
    email = db.Column(db.String(50), nullable= False)
    password = db.Column(db.String(20), nullable= False)
    is_teacher = db.Column(db.Boolean)
    is_admin= db.Column(db.Boolean, default= 0)

    def __repr__(self):
        return f'User: {self.username}'
    

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_answer = db.Column(db.String, nullable = False)
    accuracy = db.Column(db.Integer, nullable = False)
    test_id= db.Column(db.Integer, db.ForeignKey('test.id'), nullable= False)

    date_complete = db.Column(db.String, nullable= False)
    time_complete = db.Column(db.String, nullable= False)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable= False)
    user_name = db.Column(db.String, nullable= False)

    test_code= db.Column(db.Integer, nullable= True)

    user= db.relationship('User', backref='scores')
    test= db.relationship('Test', backref='scores')