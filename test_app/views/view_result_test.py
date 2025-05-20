import flask, time, datetime

from ..models import Test, Quiz
from Project.database import db
from flask_login import current_user

from Project.render_page import render_page

from auth.models import Score

@render_page(template_name = 'result_test.html')
def render_test_result(test_code):
    count_correct_answers= 0
    str_user_answers = ""
    
    test_id= flask.request.args.get("test_id")

    quizzes_list= Quiz.query.filter_by(test_id= test_id).all()
    user_answers= flask.session.get("user_answer", [ ])

    for number, quiz in enumerate(quizzes_list):
        str_user_answers += f'{user_answers[number]}%$№'
        print(f'Сверху принт ответов')
        print(str_user_answers)
        if quiz.correct_answer == user_answers[number]:
            count_correct_answers += 1
        
    test = Test.query.filter_by(id= quizzes_list[0].test_id).first()

    score = Score(
        user_answer= str_user_answers,
        accuracy= count_correct_answers/len(quizzes_list) * 100 // 1,
        date_complete = datetime.date.today(),
        test_id = test_id,
        user_id = current_user.id
    )
    db.session.add(score)
    db.session.commit()
        
    return {
        "total_questions": test.total_questions,
        'accuracy': count_correct_answers/len(quizzes_list) * 100 // 1,
        'count_correct_answers': count_correct_answers
    }

