from user.models import User
from flask_login import current_user
import flask

from Project.render_page import render_page
from user.models import Score
from test_app.models import Test

def bubble_sort(list_):
    n = len(list_)
    for i in range(n):
        for j in range(0, n-i-1):
            if list_[j][0] <= list_[j+1][0] :
                list_[j], list_[j+1] = list_[j+1], list_[j]
    return list_

@render_page(template_name = 'profile.html')
def render_profile():
    accuracy = []
    accuracy_sort = []
    dates_complete = []
    scores= None
    list_tests = []
    list_tests_sort = []
    selected_option = ["date"]
    if current_user.is_authenticated:
        user = User.query.filter_by(id= current_user.id)
        
        scores = Score.query.filter_by(user_id= current_user.id).all()
        for score in scores:
            accuracy.append(score.accuracy)
            accuracy_sort.append([score.accuracy, score.id, score.test_id, score.date_complete])
            dates_complete.append(score.date_complete)
            if Test.query.filter_by(id= score.test_id).first() not in list_tests:
                list_tests.append(Test.query.filter_by(id= score.test_id).first())

        bubble_sort(list_=accuracy_sort)
        for id in accuracy_sort:
            list_tests_sort.append(Test.query.filter_by(id= id[2]).first())
        print(accuracy_sort)
        print(list_tests_sort)


        
        if flask.request.method == 'POST':
            selected_option[0] = (flask.request.form.get('choice'))
            print(selected_option)

        return{"user": user,
               'list_tests': list_tests,
               "scores": scores,
               "selected_option": selected_option,
               "list_tests_sort": list_tests_sort,
               "accuracy_sort": accuracy_sort
               }

    else:
        return {"user": None}

