import flask, datetime

from ..models import Test, Quiz
from Project.database import db
from flask_login import current_user
from Project.clear_cookie import clear_cookies
from user.models import Score

def render_test_result():
    list_answers= []
    count_correct_answers= 0
    user_answers_list = []
    str_user_answers= ""
    
    test_id= flask.request.args.get("test_id")

    test = Test.query.filter_by(id= test_id).first()
    quizzes_list= Quiz.query.filter_by(test_id= test_id).all()
        
    for quiz in quizzes_list:
        if quiz.question_type == "input":
            list_answers.append(quiz.correct_answer)
        else :
            list_answers.append(quiz.answer_options.split("%$№"))
            
    user_answers_cookies = flask.request.cookies.get(key= 'user_answers')
    task_test_id = flask.request.cookies.get(key= 'taskTestId') or None
    class_id = flask.request.cookies.get(key= 'classId') or None

    if user_answers_cookies:
        user_answers_list = user_answers_cookies.split("|")

        for number, quiz in enumerate(quizzes_list):
            str_user_answers += f"|{user_answers_list[number]}|"

        for index, quiz in enumerate(quizzes_list):
            if quiz.question_type == "multiple_choice":
                user_answers_list[index]=  user_answers_list[index].split("$$$")
        
        for number, quiz in enumerate(quizzes_list):     
            if (quiz.question_type == "choice" or quiz.question_type == "input" or quiz.question_type == "image") and quiz.correct_answer == user_answers_list[number]:
                count_correct_answers += 1
            if quiz.question_type == "multiple_choice":    
                if sorted(quiz.correct_answer.split("%$№")) == sorted(user_answers_list[number]):
                    count_correct_answers += 1

        if current_user.is_authenticated:
            score = Score(
                user_answer= str_user_answers,
                accuracy= count_correct_answers/len(quizzes_list) * 100 // 1,
                date_complete= datetime.date.today(),
                time_complete= datetime.datetime.now().strftime("%H:%M:%S"),
                task_test_id= task_test_id or 0, 
                test_id= test_id,
                class_id= class_id,
                user_id= current_user.id,
                user_name= current_user.username
            )

            db.session.add(score)
            db.session.commit()

        result_test_page = flask.render_template(
            'result_test.html',
            test = test,
            accuracy=count_correct_answers / len(quizzes_list) * 100 // 1,
            count_correct_answers=count_correct_answers,
            list_quiz= quizzes_list,
            list_answers= list_answers,
            user_answers= user_answers_list,
            task_test_id= task_test_id,
            class_id= class_id,
            is_authorization = current_user.is_authenticated,
            username = current_user.username if current_user.is_authenticated else "", 
            is_teacher= current_user.is_teacher if current_user.is_authenticated else "",
            is_admin = current_user.is_admin if current_user.is_authenticated else ""
            )

        response = clear_cookies(non_clear_cookie= "user_answers", maked_response= result_test_page)
        response.set_cookie(key= "user_answers", value="", max_age=0) 
        
        return response
    
    return flask.redirect("/")