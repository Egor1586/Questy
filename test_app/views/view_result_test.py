import flask, datetime

from ..models import Test, Quiz
from Project.database import db
from flask_login import current_user

from Project.render_page import render_page

from user.models import Score

def delete_cookies(key):
    print("delete user answers")
    response = flask.make_response()
    response.set_cookie(key= key, value= "value", max_age=0)
    response.delete_cookie(key=key)

    return response

@render_page(template_name = 'result_test.html')
def render_test_result():
    list_answers= []
    count_correct_answers= 0
    user_answers_list = []
    str_user_answers= ""

    test_id= flask.request.args.get("test_id")

    for quiz in Quiz.query.filter_by(test_id= test_id).all():
        quizzes_list= Quiz.query.filter_by(test_id= test_id).all()
        list_answers.append(quiz.answer_options.split("%$№"))
    
    user_answers_cookies = flask.request.cookies.get(key= 'user_answers')
    user_answers = user_answers_cookies.split("|")

    for answer in user_answers:
        if answer != "":
            user_answers_list.append(answer)
    
    print(user_answers_list)

    for number, quiz in enumerate(quizzes_list):
        str_user_answers += user_answers_list[number]
        print(quiz.correct_answer, user_answers_list[number])
        if quiz.correct_answer == user_answers_list[number]:
            count_correct_answers += 1

    print(str_user_answers)
        
    test = Test.query.filter_by(id= test_id).first()

    if current_user.is_authenticated:
        score = Score(
            user_answer= str_user_answers,
            accuracy= count_correct_answers/len(quizzes_list) * 100 // 1,
            date_complete = datetime.date.today(),
            test_id = test_id,
            user_id = current_user.id
        )
        db.session.add(score)
        db.session.commit()#

    delete_cookies(key= "user_answers")

    return {
        "total_questions": test.total_questions,
        'accuracy': count_correct_answers/len(quizzes_list) * 100 // 1,
        'count_correct_answers': count_correct_answers,
        "list_quiz": quizzes_list,
        "list_answers": list_answers,
        "user_anwsers": user_answers_list
    }
