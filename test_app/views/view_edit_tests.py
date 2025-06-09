import flask
from ..models import Test, Quiz

from Project.database import db

from flask_login import current_user
from Project.render_page import render_page

@render_page(template_name = 'edit_test.html')
def render_test_app(test_code):
    
    list_quiz = []
    list_answers= []

    test_id = flask.request.args.get('test_id')
    test = Test.query.filter_by(id= test_id).first()

    for quiz in Quiz.query.filter_by(test_id= test_id).all():
        list_answers.append(quiz.answer_options.split("%$№"))
        list_quiz.append(quiz)
        
    return {
        "test": test,
        "list_quiz": list_quiz,
        "list_answers": list_answers
    }

def delete_quiz_question(quiz_id):
    quiz = Quiz.query.filter_by(id = quiz_id).first()
    test = Test.query.filter_by(id = quiz.test_id).first()

    if test.author_name == current_user.username:
        test.total_questions -= 1 
        db.session.delete(quiz)
        db.session.commit()
    
    return flask.redirect(location= f'/test_app{test.test_code}?test_id={test.id}')