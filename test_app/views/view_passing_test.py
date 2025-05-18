import flask
from ..models import Test, Quiz

from flask_login import current_user
    
user_answers= []

def render_passing_test(test_code):
    list_answers= []
    list_quiz= []

    test_id= flask.request.args.get("test_id")

    test= Test.query.filter_by(id= test_id).first()

    for quiz in Quiz.query.filter_by(test_id= test_id).all():
        list_answers.append(quiz.answer_options.split("%$№"))
        list_quiz.append(quiz)

    if flask.request.method == "POST":
        quiz_test_id = list_quiz[0].test_id

        for id in range(test.total_questions):
            if id != test.total_questions:
                try:
                    user_answers.append(flask.request.form[f'answers{quiz_test_id + id}'])
                except Exception as error:
                    user_answers.append("not answer")
                    print(error)

        print(user_answers)

        return flask.redirect(f"/result_test{test.test_code}?test_id= {test.id}")
                
    return flask.render_template(
        template_name_or_list = 'passing_test.html',
        is_authorization = current_user.is_authenticated,
        username = current_user.username if current_user.is_authenticated else "", 
        is_teacher= current_user.is_teacher if current_user.is_authenticated else "",
        test = test,
        list_quiz = list_quiz,
        list_answers= list_answers
    )