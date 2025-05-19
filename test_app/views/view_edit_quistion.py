import flask
from flask_login import current_user

from Project.database import db
from ..models import Test, Quiz
from Project.render_page import render_page

@render_page(template_name = 'edit_question.html')
def render_edit_question():

    list_answers = []

    answer_options = " "
    correct_answer = " " 
    answer = " "
    message = " "

    quiz_id= flask.request.args.get("quiz_id")
    test_id= flask.request.args.get("test_id")

    quiz = Quiz.query.filter_by(id = quiz_id).first()
    test = Test.query.filter_by(id = test_id).first()

    list_answers = quiz.answer_options.split("%$№")
    
    if flask.request.method == 'POST':

        for number in range(test.answers_per_question - 1):
            try:
                answer = flask.request.form[f'answer{number}']
                answer_options += f'%$№{answer}' if number > 0 else answer
            except Exception:
                pass

        correct_answer = flask.request.form['correct_answer']
        if answer:
            answer_options += f'%$№{correct_answer}'
            quiz.correct_answer = correct_answer
            quiz.answer_options = answer_options
            db.session.commit()
            return flask.redirect(f"/test_app{test.test_code}?test_id={test.id}")
        else:
            message = "Enter some values"
        
        
    return {
        "test" : test,        
        "quiz" : quiz,
        "quiz_id" : quiz.id,
        "list_answers" : list_answers,
        "correct_answer" : quiz.correct_answer,
        "message" : message
    }