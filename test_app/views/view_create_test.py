import flask
from Project.render_page import render_page

@render_page(template_name = 'create_test.html')
def render_create_test():

    data = flask.request.get_json()
    print(data)

    return flask.redirect(location = '/quizzes')

    # try:
    #     title = flask.request.form['title']
    #     description = flask.request.form['description']
    #     total_questions = flask.request.form['total_questions']
    #     answers_per_question= flask.request.form["answers_per_question"]
    #     time= flask.request.form["time"]
    #     image_form = flask.request.files.get('image', None)

    #     total_questions = total_questions or 10
    #     answers_per_question = answers_per_question or 4
    #     time= time or 20
    
    #     test = Test(
    #         title= title,
    #         description= description,
    #         total_questions = total_questions,
    #         answers_per_question = answers_per_question,
    #         test_code= 0,
    #         author_name = current_user.username,
    #         image=  1 if image_form else 0,
    #         created_date= datetime.date.today()
    #     )

    #     db.session.add(test)
    #     db.session.commit()

    #     if test.image:
    #         image_form.save(os.path.abspath(os.path.join(__file__, "..", "..","..","home_app","static","images", "media", f"{test.id}.png")))

    #     # NEW_TYPE
    #     for quizzes in data["questions"]:
    #         answers_list = quizzes["options"].copy()
    #         image_name= quizzes.get("image_name")
    #         random.shuffle(answers_list)
    #         quiz = Quiz(
    #             question_type = quizzes["question_type"],
    #             question_text = quizzes["question_text"],
    #             image_name= image_name if image_name else None,
    #             answer_options = "%$№".join(answers_list),
    #             correct_answer = quizzes["correct_answer"],
    #             time= quizzes["time"],
    #             test_id = test.id             
    #         )
    #         db.session.add(quiz)

    #         if quiz.image_name:
    #             print("quiz image path")
    #             image_form.save(os.path.abspath(os.path.join(__file__, "..", "..","..","home_app","static","images", "media", f"{image_name}.png")))

    #     db.session.commit()  

    # except Exception as error:
    #     print(error)
   
    return {}