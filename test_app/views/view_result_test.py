import flask

from ..models import Test, Quiz
from Project.database import db
from .view_passing_test import user_answers
from flask_login import current_user

def render_test_result(test_code):

    count_correct_answers= 0
    procent_correct_answers= 0
    
    test_id= flask.request.args.get("test_id")

    quizzes_list= Quiz.query.filter_by(test_id= test_id).all()

    for number, quiz in enumerate(quizzes_list):
        if quiz.correct_answer == user_answers[number]:
            count_correct_answers += 1

    procent_correct_answers= count_correct_answers/len(quizzes_list) * 100 // 1

    test = Test.query.filter_by(id= quizzes_list[0].test_id).first()
        
    return flask.render_template(
        template_name_or_list= 'result_test.html', 
        is_authorization = current_user.is_authenticated,
        username = current_user.username if current_user.is_authenticated else "", 
        is_teacher= current_user.is_teacher if current_user.is_authenticated else "",
        total_questions= test.total_questions,
        procent_correct_answers= procent_correct_answers,
        count_correct_answers= count_correct_answers
        )

