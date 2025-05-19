import flask
from flask_login import current_user
from test_app.models import Test    

from Project.database import db
from Project.render_page import render_page

@render_page(template_name = 'quizzes.html')
def render_quizzes():
    list_your_test= []
    list_tests = Test.query.all()
    
    count_of_tests = 0

    for test in list_tests:
        if test.author_name == current_user.username:
            list_your_test.append(test)

    count_of_tests = int(len(list_tests))
    
    return{
    "list_tests": list_your_test,
    "count_of_tests": count_of_tests
    }
    

def delete_test(test_id):
    test = Test.query.filter_by(id = test_id).first()
    if current_user.username ==  test.author_name:
        db.session.delete(test)
        db.session.commit()

    return flask.redirect("/quizzes/")