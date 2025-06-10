# from Project.database import db

# class Room(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     test_id= db.Column(db.Integer, nullable= True)
#     test_code = db.Column(db.String(10), nullable= False)
    
#     users_in_room = db.relationship('Users_in_room', backref='room', cascade="all, delete-orphan")


# class Users_in_room(db.Model):
#     id = db.Column(db.Integer, primary_key=True)

#     user_id = db.Column(db.String(100), nullable=True)
#     answer_options = db.Column(db.String(300), nullable=True)
#     correct_answer = db.Column(db.String(100), nullable=True)
    
#     test_id = db.Column(db.Integer, db.ForeignKey('test.id'))

