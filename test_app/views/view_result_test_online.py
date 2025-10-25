from Project.render_page import render_page

from flask_login import current_user

from ..models import Test, Room, Quiz
from user.models import User, Score

@render_page(template_name = 'result_test_online.html')
def render_result_test_online(id):
    list_answers = []
    user_answers_list = []
    count_correct_answers = 0

    scores = Score.query.filter_by(id = id).first()
    test = Test.query.filter_by(id= scores.test_id).first()

    for quiz in Quiz.query.filter_by(test_id= scores.test_id).all():
        quizzes_list= Quiz.query.filter_by(test_id= scores.test_id).all()
        list_answers.append(quiz.answer_options.split("%$№"))

    user_answers_db = scores.user_answer
    user_answers = user_answers_db.split("|")

    for answer in user_answers:
        if answer != "":
            user_answers_list.append(answer)


    for number, quiz in enumerate(quizzes_list):
            if quiz.correct_answer == user_answers_list[number]:
                count_correct_answers += 1

    return {
        "total_question": test.total_questions,
        "accuracy": scores.accuracy,
        "list_quiz": quizzes_list,
        "list_answers": list_answers,
        "user_answers": user_answers_list,
        "count_correct_answers":count_correct_answers
            }