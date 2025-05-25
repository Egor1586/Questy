import flask
from ..models import Test, Quiz

from flask_login import current_user
from Project.render_page import render_page

@render_page(template_name = 'passing_test.html')
def render_passing_test(test_code):
    list_answers= []
    list_quiz= []
    user_answers= []

    test_id= flask.request.args.get("test_id")

    test= Test.query.filter_by(id= test_id).first()

    for quiz in Quiz.query.filter_by(test_id= test_id).all():
        list_answers.append(quiz.answer_options.split("%$№"))
        list_quiz.append(quiz)

    if flask.request.method == "POST":
        quiz_test_id = list_quiz[0].id

        for id in range(test.total_questions):
            if id != test.total_questions:
                try:
                    user_answers.append(flask.request.form[f'answers{quiz_test_id + id}'])
                except Exception as error:
                    user_answers.append("not answer")

        flask.session["user_answer"]= user_answers.copy()
        user_answers.clear()

        return flask.redirect(f"/result_test{test.test_code}?test_id= {test.id}")
                
    return {
        "test": test,
        "list_quiz": list_quiz,
        "list_answers": list_answers
    }