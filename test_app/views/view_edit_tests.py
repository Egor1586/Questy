import flask
from ..models import Test, Quiz

from Project.database import db

from flask_login import current_user

def render_test_app(test_code):
    
    list_quiz = []
    list_answers= []

    test_id = flask.request.args.get('test_id')
    test = Test.query.filter_by(id= test_id).first()

    for quiz in Quiz.query.filter_by(test_id= test_id).all():
        list_answers.append(quiz.answer_options.split("%$№"))
        list_quiz.append(quiz)
        
    return flask.render_template(
        template_name_or_list= 'edit_test.html', 
        is_authorization = current_user.is_authenticated,
        username = current_user.username if current_user.is_authenticated else "", 
        is_teacher= current_user.is_teacher if current_user.is_authenticated else "",
        test= test,
        list_quiz= list_quiz,
        list_answers= list_answers
        )



def delete_quiz_question(quiz_id):
    quiz = Quiz.query.filter_by(id = quiz_id).first()
    test = Test.query.filter_by(id = quiz.test_id).first()

    if test.author_name == current_user.username:
        db.session.delete(quiz)
        db.session.commit()
        test.total_questions -= 1 
    return flask.redirect(location= f'/test_app{test.test_code}?test_id={test.id}')