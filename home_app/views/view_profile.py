import flask
import matplotlib.pyplot as plt
import io

import datetime


from flask_login import current_user

from Project.render_page import render_page
from user.models import Score, User
from test_app.models import Test

def bubble_sort(list):
    list_length = len(list)
    for length in range(list_length):
        for accuracy in range(0, list_length - length - 1):
            if list[accuracy][0] <= list[accuracy+ 1][0] :
                list[accuracy], list[accuracy+ 1] = list[accuracy+ 1], list[accuracy]
    return list

@render_page(template_name='profile.html')
def render_profile():
    accuracy = []
    accuracy_sort = []
    dates_complete = []
    count_cmpl_quiz= []
    scores= None
    list_tests = []
    list_tests_sort = []
    selected_option = ["graph_1"]
    selected_option_test = ["date"]
    message = ' '
    tests_count= 0
    scores_count= 0
    user= None

    fig, axes = plt.subplots()
    buffer = io.BytesIO()
    if current_user.is_authenticated:
        user = User.query.filter_by(id=current_user.id).first()
        
        scores = Score.query.filter_by(user_id= current_user.id).all()
        tests_count = len(Test.query.filter_by(author_name= current_user.username).all())
        scores_count= len(scores)

        print(tests_count, scores_count)
        for score in scores:
            accuracy.append(score.accuracy)
            accuracy_sort.append([score.accuracy, score.id, score.test_id, score.date_complete, score.time_complete])
            dates_complete.append(score.date_complete)
            if Test.query.filter_by(id= score.test_id).first() not in list_tests:
                list_tests.append(Test.query.filter_by(id= score.test_id).first())

        bubble_sort(list= accuracy_sort)
        for id in accuracy_sort:
            if Test.query.filter_by(id= id[2]).first() not in list_tests_sort:
                list_tests_sort.append(Test.query.filter_by(id= id[2]).first())

        print(accuracy_sort)
        
        if flask.request.method == 'POST':
            if flask.request.form.get('choice') != None:
                selected_option[0] = (flask.request.form.get('choice'))
                
            if flask.request.form.get('choice_test') != None:
                selected_option_test[0] = (flask.request.form.get('choice_test'))
                
           
            print(selected_option_test)
    
        dates_complete.sort()

        if selected_option[0] == 'graph_1':
            dates_complete = ['2025-07-20', '2025-07-21', '2025-07-22']
            accuracy = [13, 25, 66]

            return {
                "scores": scores,
                "scores_count": scores_count,
                "tests_count": tests_count,
                "dates_complete": dates_complete,
                'accuracy': accuracy or [],
                'list_tests': list_tests,
                "selected_option": selected_option,
                "selected_option_test": selected_option_test,
                'wt_graph': '1',
                'count_cmpl_quiz': count_cmpl_quiz or [],
                'user': user,
                "list_tests_sort": list_tests_sort,
                "accuracy_sort": accuracy_sort
            }
        
        elif selected_option[0] == 'graph_2':  
            for date in dates_complete:
                count = Score.query.filter_by(user_id=current_user.id, date_complete=date).count()
                count_cmpl_quiz.append(count)

            print(count_cmpl_quiz)
            print(dates_complete)

            return {
                "scores": scores,
                'list_tests': list_tests,
                'dates_complete': dates_complete,
                "scores_count": scores_count,
                "tests_count": tests_count,
                'wt_graph': 'd_cmpl',
                'count_cmpl_quiz': count_cmpl_quiz or [],
                'accuracy': accuracy or [],
                "selected_option": selected_option,
                "selected_option_test": selected_option_test,
                'user': user,
                "list_tests_sort": list_tests_sort,
                "accuracy_sort": accuracy_sort
            }

        elif selected_option[0] == 'graph_3':
            
            obj_date = datetime.datetime.strptime(dates_complete[0], '%Y-%m-%d')
            delta_week = (obj_date + datetime.timedelta(days=7))
            if delta_week <= obj_date:
                dates_complete = ['2025-07-20', '2025-07-21','2025-07-22']
                accuracy = [13, 25, 60]

            else:
                message = 'Занадто мало даних для побудови графіка'
                return{
                    "scores": scores,
                    "scores_count": scores_count,
                    "tests_count": tests_count,
                    'message': message,
                    'flag_graph': 'flag_graph',
                    'dates_complete': dates_complete,
                    'accuracy': accuracy or [],
                    'list_tests': list_tests,
                    "selected_option": selected_option,
                    "selected_option_test": selected_option_test,
                    'count_cmpl_quiz': count_cmpl_quiz or [],
                    'user': user,
                    "list_tests_sort": list_tests_sort,
                    "accuracy_sort": accuracy_sort
                    }
            
        elif selected_option[0] == 'graph_4':
            
            obj_date = datetime.datetime.strptime(dates_complete[0], '%Y-%m-%d')
            delta_week = (obj_date + datetime.timedelta(days=31))
            
            if delta_week <= obj_date:

                dates_complete = ['2025-07-20', '2025-07-21','2025-07-22']
                accuracy = [13, 25, 60]
                message = 'Занадто мало даних для побудови графіка'
            
            return{
                "scores": scores,
                "scores_count": scores_count,
                "tests_count": tests_count,
                'message': message,
                'flag_graph': 'flag_graph',
                'dates_complete': dates_complete,
                'accuracy': accuracy or [],
                'list_tests': list_tests,
                "selected_option": selected_option,
                "selected_option_test": selected_option_test,
                'count_cmpl_quiz': count_cmpl_quiz or [],
                'user': user,
                "list_tests_sort": list_tests_sort,
                "accuracy_sort": accuracy_sort
                }
    else:
        message = "Ви не авторизовані"

    selected_option = ['0']

    return {
        "scores": scores,
        "scores_count": scores_count,
        "tests_count": tests_count,
        'message': message,
        'list_tests': list_tests,
        'count_cmpl_quiz': count_cmpl_quiz or [],
        'accuracy': accuracy or [],
        'user': user,
        'list_tests': list_tests,
        "scores": scores,
        "selected_option": selected_option,
        "selected_option_test": selected_option_test,
        "list_tests_sort": list_tests_sort,
        "accuracy_sort": accuracy_sort
        }

