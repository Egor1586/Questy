import flask, random, datetime

from flask_login import current_user
from Project.database import db
from ..models import Test, Quiz
from ..generat_test import generate_test


def render_new_quiz():
    data= {
        "topic": "Основи Python",
        "description": "Тест на базові знання Python для початківців.",
        "questions": [
            {
            "question_text": "Яка правильна команда для виводу тексту на екран у Python?",
            "options": [
                "echo('Hello World')",
                "console.log('Hello World')",
                "printf('Hello World')",
                "print('Hello World')"
            ],
            "correct_answer": "print('Hello World')"
            },
            {
            "question_text": "Який тип даних використовується для зберігання цілих чисел у Python?",
            "options": [
                "float",
                "str",
                "bool",
                "int"
            ],
            "correct_answer": "int"
            },
            {
            "question_text": "Як позначається початок коментаря в Python?",
            "options": [
                "//",
                "<!-- -->",
                "/* */",
                "#"
            ],
            "correct_answer": "#"
            },
            {
            "question_text": "Який з наведених варіантів створює список у Python?",
            "options": [
                "(1, 2, 3)",
                "{1, 2, 3}",
                "<1, 2, 3>",
                "[1, 2, 3]"
            ],
            "correct_answer": "[1, 2, 3]"
            },
            {
            "question_text": "Як можна отримати довжину списку у Python?",
            "options": [
                "length(list)",
                "count(list)",
                "size(list)",
                "len(list)"
            ],
            "correct_answer": "len(list)"
            }
        ]
        }
    
    if flask.request.method == "POST":
        try:
            title = flask.request.form['title']
            description = flask.request.form['description']
            total_questions = flask.request.form['total_questions']
            answers_per_question= flask.request.form["answers_per_question"]
            
            print("HE")
            if not total_questions:
                total_questions = 10
            if not answers_per_question:
                answers_per_question = 4

            
            while True: 
                test_code= random.randint(1000, 9999)
                db_test_code = Test.query.filter_by(test_code= test_code).first()
                
                if db_test_code is None:
                    break

            test = Test(
                title= title,
                description= description,
                total_questions = total_questions,
                answers_per_question = answers_per_question,
                test_code= test_code,
                author_name = current_user.username,
                created_date= datetime.date.today()
            )

            db.session.add(test)
            db.session.commit()
            
            for quizzes in data["questions"]:
                quiz = Quiz(
                    question_text = quizzes["question_text"],
                    answer_options = "%$№".join(quizzes["options"]),
                    correct_answer = quizzes["correct_answer"],
                    test_id = test.id             
                )
                db.session.add(quiz)
                        
            db.session.commit()
                
            return flask.redirect(location = '/quizzes')

        except Exception as error:
            print(error)

    return flask.render_template(template_name_or_list = 'new_quiz.html',
        is_authorization = current_user.is_authenticated,
        username = current_user.username if current_user.is_authenticated else "", 
        is_teacher= current_user.is_teacher if current_user.is_authenticated else ""
        )