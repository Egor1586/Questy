import flask
from ..models import Test, Quiz

from flask_login import current_user
from Project.render_page import render_page

@render_page(template_name = 'view_passing_tets.html')
def render_passing_test():
    list_answers= []
    list_quiz= []

    test_id= flask.request.args.get("test_id")
    question_number= flask.request.args.get("question_number")

    test= Test.query.filter_by(id= test_id).first()

    for quiz in Quiz.query.filter_by(test_id= test_id).all():
        list_answers.append(quiz.answer_options.split("%$№"))
        list_quiz.append(quiz)
                
    return {
        "test": test,
        "list_quiz": list_quiz,
        "list_answers": list_answers,
        "question_number": int(question_number)
    }