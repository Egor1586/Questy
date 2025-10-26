import flask
import random

from Project.database import db
from ..models import Test, Quiz
from Project.render_page import render_page


@render_page(template_name="edit_question.html")
def render_edit_question():
    quiz_id = flask.request.args.get("quiz_id")
    test_id = flask.request.args.get("test_id")

    quiz = Quiz.query.filter_by(id=quiz_id).first()
    test = Test.query.filter_by(id=test_id).first()


    list_answers = quiz.answer_options.split("%$№") if quiz.answer_options else []
    correct_answer = quiz.correct_answer
    message = ""

    if flask.request.method == "POST":
        updated_answers = []

        for i in range(test.answers_per_question):
            field_name = f"answer{i}"
            new_value = flask.request.form.get(field_name, "").strip()

            if new_value:
                updated_answers.append(new_value)
                print(f"==============={i}: {new_value}")
            else:
                if i < len(list_answers):
                    updated_answers.append(list_answers[i])
                    print(f"ОТВЕТЫ: {list_answers[i]}")

        new_correct = flask.request.form.get("correct_answer", "").strip()
        if new_correct:
            quiz.correct_answer = new_correct
            if new_correct not in updated_answers:
                updated_answers.append(new_correct)
            print(f"ЕЩКЕРЕ: {new_correct}")
        else:
            quiz.correct_answer = correct_answer
            if correct_answer not in updated_answers:
                updated_answers.append(correct_answer)
            print(f"[не получилось: {correct_answer}")

        random.shuffle(updated_answers)
        quiz.answer_options = "%$№".join(updated_answers)
        db.session.commit()

        print(f"Вопроссы: {quiz.answer_options}")
        return flask.redirect(f"/test_app?test_id={test.id}")

    return {
        "test": test,
        "quiz": quiz,
        "quiz_id": quiz.id,
        "list_answers": list_answers,
        "correct_answer": correct_answer,
        "message": message,
    }