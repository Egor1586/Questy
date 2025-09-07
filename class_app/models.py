from Project.database import db

class Class(db.Model):
    id = db.Column(db.Integer, primary_key= True)

    title = db.Column(db.String(100), nullable= False)
    description = db.Column(db.String(200), nullable= False)

    class_code = db.Column(db.String(100), nullable= False)
    author_name = db.Column(db.String(100), nullable= False)
    created_date = db.Column(db.String(100), nullable= False)

    class_color = db.Column(db.String(100), nullable= False)

    tasks= db.relationship('Task', backref= 'class', cascade= "all, delete-orphan")

class Task(db.Model):
    id = db.Column(db.Integer, primary_key= True)

    title = db.Column(db.String(100), nullable= False)
    description = db.Column(db.String(200), nullable= False)

    class_id= db.Column(db.Integer, db.ForeignKey("class.id"))
    test_id= db.Column(db.Integer, db.ForeingKey("test.id"), nollable= True)
    image= db.Column(db.Boolean, nullable= True)

    test= db.relationship("Test", backreg="task")
