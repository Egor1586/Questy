import flask, random
from flask_login import current_user

from Project.database import db
from ..models import Test, Quiz
from Project.render_page import render_page

@render_page(template_name = 'edit_question.html')
def render_edit_question():

    list_answers = []
    list_user_answers= []

    answer_options = ""
    correct_answer = "" 
    answer = ""
    message = ""

    quiz_id= flask.request.args.get("quiz_id")
    test_id= flask.request.args.get("test_id")

    quiz = Quiz.query.filter_by(id = quiz_id).first()
    test = Test.query.filter_by(id = test_id).first()

    list_answers = quiz.answer_options.split("%$№") 
    correct_answer= quiz.correct_answer
    
    print(list_answers)
    print(correct_answer)
    
    if flask.request.method == 'POST':

        for number in range(test.answers_per_question):
            try:
                new_answer = flask.request.form.get(f'answer{number}', '')
                if new_answer and new_answer!= correct_answer:
                    list_user_answers.append(new_answer)
                else:
                    if list_answers[number] != correct_answer:
                        list_user_answers.append(list_answers[number])

            except Exception:
                pass
           
        new_correct_answer = flask.request.form.get('correct_answer', '')
        if new_correct_answer:
            list_user_answers.append(new_correct_answer)
            quiz.correct_answer = new_correct_answer
        else:
            quiz.correct_answer = correct_answer
            list_user_answers.append(correct_answer)

        # елси надо перемешка после введения новых вариантов ответов
        random.shuffle(list_user_answers)
        
        print(list_user_answers)
        print(new_correct_answer)
        print(correct_answer)
        for number, answer in enumerate(list_user_answers):
            if number > 0:
                answer_options+= f'%$№{answer}' 
            else:
                answer_options+= answer

        print(answer_options)
        quiz.answer_options = answer_options
        db.session.commit()
        return flask.redirect(f"/test_app{test.test_code}?test_id={test.id}") 
        
    return {
        "test" : test,        
        "quiz" : quiz,
        "quiz_id" : quiz.id,
        "list_answers" : list_answers,
        "correct_answer" : quiz.correct_answer,
        "message" : message
    }
