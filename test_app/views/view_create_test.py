import flask, random, datetime, os

from flask_login import current_user
from Project.database import db
from ..models import Test, Quiz
from ..generat_test import generate_test

from Project.render_page import render_page


@render_page(template_name = 'create_test.html')
def render_create_test():

    return {}


def create_test():

    data = flask.request.get_json()
    print(1, data)

    

    try:
        title = data.get("topic")
        description = data.get("description")
        total_questions = data.get('total_questions')
        answers_per_question= data.get('answers_per_question')
        time= data.get('time')
        image_form = data.get("image")

        print(title, description, total_questions, answers_per_question, time, image_form)

        total_questions = total_questions or len(data["questions"])
        answers_per_question = answers_per_question or 4
        time= time or 20
        
        test = Test(
            title= title,
            description= description,
            total_questions = total_questions,
            answers_per_question = answers_per_question,
            test_code= 0,
            author_name = current_user.username,
            image=  1 if image_form else 0,
            created_date= datetime.date.today()
        )

        db.session.add(test)
        db.session.commit()

        if test.image:
            image_form.save(os.path.abspath(os.path.join(__file__, "..", "..","..","home_app","static","images", "media", f"{test.id}.png")))

        # NEW_TYPE
        for quizzes in data["questions"]:
            answers_list = quizzes["options"].copy()
            image_name= quizzes.get("image_name")
            random.shuffle(answers_list)
            quiz = Quiz(
                question_type = quizzes["question_type"],
                question_text = quizzes["question_text"],
                image_name= image_name if image_name else None,
                answer_options = "%$№".join(answers_list),
                correct_answer = quizzes["correct_answer"],
                time= quizzes["time"],
                test_id = test.id             
            )
            db.session.add(quiz)

            if quiz.image_name:
                print("quiz image path")
                image_form.save(os.path.abspath(os.path.join(__file__, "..", "..","..","home_app","static","images", "media", f"{image_name}.png")))
                    
        db.session.commit()
            
        return flask.redirect(location = '/quizzes')

    except Exception as error:
        print(error)

    return {}
