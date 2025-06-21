from Project.database import db

class Test(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(100), nullable=True)
    description = db.Column(db.String(200), nullable=True)

    total_questions = db.Column(db.Integer)
    answers_per_question = db.Column(db.Integer)
    test_code = db.Column(db.Integer)
    author_name = db.Column(db.String(100), nullable=True)
    created_date = db.Column(db.String(100), nullable=True)

    image= db.Column(db.Boolean, nullable=True)

    quizes = db.relationship('Quiz', backref='test', cascade="all, delete-orphan")


class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    question_text = db.Column(db.String(100), nullable=True)
    answer_options = db.Column(db.String(300), nullable=True)
    correct_answer = db.Column(db.String(100), nullable=True)
    
    test_id = db.Column(db.Integer, db.ForeignKey('test.id'))

    def dict(self):
        return {
            "id": self.id,
            "question_text": self.question_text,
            "answer_options": self.answer_options,
            "test_id": self.test_id
        }

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    test_id= db.Column(db.Integer, nullable= True)
    test_code = db.Column(db.String(10), nullable= False)

    user_list = db.Column(db.String(300), nullable= False)

    author_name= db.Column(db.String(300), nullable= False)

    

