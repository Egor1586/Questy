import flask

from ..models import Test, Quiz
from Project.database import db
from flask_login import current_user

from Project.render_page import render_page

@render_page(template_name = 'result_test.html')
def render_test_result(test_code):

    count_correct_answers= 0
    procent_correct_answers= 0
    
    test_id= flask.request.args.get("test_id")

    quizzes_list= Quiz.query.filter_by(test_id= test_id).all()

    user_answers= flask.session.get("user_answer", [ ])

    for number, quiz in enumerate(quizzes_list):
        if quiz.correct_answer == user_answers[number]:
            count_correct_answers += 1

    procent_correct_answers= count_correct_answers/len(quizzes_list) * 100 // 1

    test = Test.query.filter_by(id= quizzes_list[0].test_id).first()
        
    return {
        "total_questions": test.total_questions,
        'procent_correct_answers': procent_correct_answers,
        'count_correct_answers': count_correct_answers
    }

