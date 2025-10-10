from Project.database import db

class Test(db.Model):
    id = db.Column(db.Integer, primary_key= True)

    title = db.Column(db.String(100), nullable= False)
    description = db.Column(db.String(200), nullable= False)

    total_questions = db.Column(db.Integer, nullable= False)
    answers_per_question = db.Column(db.Integer, nullable= True)
    test_code = db.Column(db.Integer, nullable= True)
    author_name = db.Column(db.String(100), nullable= False)
    created_date = db.Column(db.String(100), nullable= False)

    image= db.Column(db.Boolean, nullable= True)

    quizes= db.relationship('Quiz', backref= 'test', cascade= "all, delete-orphan")


class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key= True)

    question_type = db.Column(db.String(50), nullable= False)
    question_text = db.Column(db.String(100), nullable= False)
    image_name = db.Column(db.String(200), nullable= True)
    answer_options = db.Column(db.String(300), nullable= True)
    correct_answer = db.Column(db.String(100), nullable= True)
    time= db.Column(db.Integer, nullable= True)
    
    test_id = db.Column(db.Integer, db.ForeignKey('test.id'))

    def dict(self):
        return {
            "id": self.id,
            "question_type": self.question_type,
            "question_text": self.question_text,
            "image_name": self.image_name,
            "answer_options": self.answer_options,
            "correct_answer": self.correct_answer,
            "time": self.time,
            "test_id": self.test_id
        }

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    test_id= db.Column(db.Integer, nullable= False)
    test_code = db.Column(db.String(10), nullable= False)

    user_list = db.Column(db.String(300), nullable= False)

    author_name= db.Column(db.String(300), nullable= False)

    active_test= db.Column(db.Boolean, nullable= True)

    all_members = db.Column(db.String(300), nullable = False)
