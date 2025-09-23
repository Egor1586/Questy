from flask_login import UserMixin
from Project.database import db

class_user= db.Table(
    "class_user",
    db.Column("class_id", db.Integer, db.ForeignKey("classes.id")),
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"))
)
    
class User(db.Model, UserMixin):

    id = db.Column(db.Integer, primary_key= True)
    username = db.Column(db.String(20), nullable= False)
    email = db.Column(db.String(50), nullable= False)
    password = db.Column(db.String(20), nullable= False)
    is_teacher = db.Column(db.Boolean)
    is_admin= db.Column(db.Boolean, default= 0)

    classes= db.relationship('Classes', secondary= class_user, back_populates='users')

    def __repr__(self):
        return f'User: {self.username}'
    
class Classes(db.Model):
    id = db.Column(db.Integer, primary_key= True)

    title = db.Column(db.String(100), nullable= False)
    description = db.Column(db.String(200), nullable= False)

    class_code = db.Column(db.String(100), nullable= False)
    created_date = db.Column(db.String(100), nullable= False)

    class_color1 = db.Column(db.String(100), nullable= True)
    class_color2 = db.Column(db.String(100), nullable= True)

    max_user_count= db.Column(db.Integer, nullable= True)

    teacher_id= db.Column(db.Integer, db.ForeignKey("user.id"))
    teacher= db.relationship("User", backref= "classes_created")
    
    tasks= db.relationship('Task', backref= 'classes', cascade= "all, delete-orphan")

    users= db.relationship('User', secondary= class_user, back_populates= "classes")

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_answer = db.Column(db.String, nullable = False)
    accuracy = db.Column(db.Integer, nullable = False)
    test_id= db.Column(db.Integer, db.ForeignKey('test.id'))

    date_complete = db.Column(db.String, nullable= False)
    time_complete = db.Column(db.String, nullable= False)

    task_test_id= db.Column(db.Integer, db.ForeignKey("task.id"))
    class_id= db.Column(db.Integer, db.ForeignKey("classes.id"))

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable= False)
    user_name = db.Column(db.String, nullable= False)

    test_code= db.Column(db.Integer, nullable= True)

    user= db.relationship('User', backref='scores')
    test= db.relationship('Test', backref='scores')


class Task(db.Model):
    id = db.Column(db.Integer, primary_key= True)

    title = db.Column(db.String(100), nullable= False)
    description = db.Column(db.String(200), nullable= False)

    due_time = db.Column(db.DateTime, nullable= False)

    work_after_time= db.Column(db.Boolean, default= False)

    class_id= db.Column(db.Integer, db.ForeignKey("classes.id"))
    test_id= db.Column(db.Integer, db.ForeignKey("test.id"), nullable= True)
    image= db.Column(db.Boolean, default= False)

    test= db.relationship("Test", backref="tasks")
