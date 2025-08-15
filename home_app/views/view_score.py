import flask
import matplotlib.pyplot as plt
import io

import datetime

from flask_login import current_user

from Project.render_page import render_page
from user.models import Score
from test_app.models import Test


# @render_page(template_name='score.html')
# def render_score():
#     fig, axes = plt.subplots()
#     buffer = io.BytesIO()
#     accuracy = []
#     dates_complete = []
#     message = ' '
#     scores= None
#     list_tests = []
#     selected_option = ['0']

#     if current_user.is_authenticated:
#         scores = Score.query.filter_by(user_id= current_user.id).all()
#         for score in scores:
#             accuracy.append(score.accuracy)
#             dates_complete.append(score.date_complete)
#             if Test.query.filter_by(id= score.test_id).first() not in list_tests:
#                 list_tests.append(Test.query.filter_by(id= score.test_id).first())
        
#         if flask.request.method == 'POST':
#             selected_option[0] = (flask.request.form.get('choice'))
#             print(selected_option)

    
#         dates_complete.sort()

#         if selected_option[0] == 'graph_1':
#             dates_complete = ['2025-07-20', '2025-07-21', '2025-07-22']
#             accuracy = [13, 25, 66]

#             return {
#                 "scores": scores,
#                 "dates_complete": dates_complete,
#                 'accuracy': accuracy,
#                 'list_tests': list_tests,
#                 'wt_graph': '1'
#             }
        
#         elif selected_option[0] == 'graph_2':
            
#             count_cmpl_quiz = []

#             for date in dates_complete:
#                 count = Score.query.filter_by(user_id=current_user.id, date_complete=date).count()
#                 count_cmpl_quiz.append(count)
            
#             print(f'Это кол-во пройденных тестов: {count_cmpl_quiz}')
#             count_cmpl_quiz = [5,3,2,3]
#             print(dates_complete)
#             dates_complete = ['2025-07-20', '2025-07-21','2025-07-22', '2025-08-08']



#             return {
#                 'dates_complete': dates_complete,
#                 'wt_graph': 'd_cmpl',
#                 'count_cmpl_quiz': count_cmpl_quiz
#             }

#         elif selected_option[0] == 'graph_3':
            
#             obj_date = datetime.datetime.strptime(dates_complete[0], '%Y-%m-%d')
#             delta_week = (obj_date + datetime.timedelta(days=7))
#             if delta_week <= obj_date:

#                 dates_complete = ['2025-07-20', '2025-07-21','2025-07-22']
#                 accuracy = [13, 25, 60]

                
                
#             else:
#                 message = 'Занадто мало даних для побудови графіка'
#                 return{
#                     "scores": scores,
#                     'message': message,
#                     'flag_graph': 'flag_graph',
#                     'dates_complete': dates_complete,
#                     'accuracy': accuracy,
#                     'list_tests': list_tests
#                     }
            
#         elif selected_option[0] == 'graph_4':
            
#             obj_date = datetime.datetime.strptime(dates_complete[0], '%Y-%m-%d')
#             delta_week = (obj_date + datetime.timedelta(days=31))
            
#             if delta_week <= obj_date:

#                 dates_complete = ['2025-07-20', '2025-07-21','2025-07-22']
#                 accuracy = [13, 25, 60]

                
                
#             else:
#                 message = 'Занадто мало даних для побудови графіка'
#                 return{
#                     "scores": scores,
#                     'message': message,
#                     'flag_graph': 'flag_graph',
#                     'dates_complete': dates_complete,
#                     'accuracy': accuracy,
#                     'list_tests': list_tests
#                     }
#     else:
#         message = "Ви не авторизовані"


#     return {
#         "scores": scores,
#         'message': message,
#         'list_tests': list_tests
#         }