import flask
import matplotlib.pyplot as plt
import io
import base64
import datetime

from flask_login import current_user

from Project.render_page import render_page
from user.models import Score
from test_app.models import Test


@render_page(template_name='score.html')
def render_score():
    fig, axes = plt.subplots()
    buffer = io.BytesIO()
    accuracy = []
    dates_complete = []
    message = ''
    list_tests = []
    selected_option = ['0']
    if flask.request.method == 'POST':
        print(f'=========')
        selected_option[0] = (flask.request.form.get('choice'))
        print(f'Это оптион: {selected_option}')
    elif current_user.is_authenticated:
        scores = Score.query.filter_by(user_id= current_user.id).all()

        for score in scores:
            accuracy.append(score.accuracy)
            dates_complete.append(score.date_complete)
            if Test.query.filter_by(id= score.test_id).first() not in list_tests:
                list_tests.append(Test.query.filter_by(id= score.test_id).first())
    
        dates_complete.sort()
        print(f'1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        if selected_option[0] == 'graph_1':
            print(f'выводит график')
            axes.set_xlabel("Дата прохождения теста")
            axes.set_ylabel("Точность %")
            axes.set_title("Прогресс пользователя")
            axes.plot(dates_complete, accuracy, marker='o')
            plt.savefig(buffer, format='png')

            buffer.seek(0)
            image_bytes = buffer.read()
            graph_to_html = base64.b64encode(image_bytes).decode('utf-8')
            buffer.close()

            return {
                "scores": scores,
                'graph': graph_to_html,
                'list_tests': list_tests
            }
        
        elif selected_option[0] == 'graph_2':
            
            obj_date = datetime.datetime.strptime(dates_complete, '%Y-%m-%d')
            delta_week = (obj_date + datetime.timedelta(days=7))
            if delta_week <= obj_date:
                print(f'Зашло в условие')
            
                axes.set_xlabel("Дата прохождения теста")
                axes.set_ylabel("Точность %")
                axes.set_title("Прогресс пользователя")
                axes.plot(dates_complete[1], accuracy, marker='o')
                plt.savefig(buffer, format='png')

                buffer.seek(0)
                image_bytes = buffer.read()
                graph_to_html = base64.b64encode(image_bytes).decode('utf-8')
                buffer.close()

                return {
                    "scores": scores,
                    'graph': graph_to_html,
                    'list_tests': list_tests}
            
            else:
                message = 'Слишком мало данных для построения графика'
                return{'message': message}

        elif selected_option[0] == 'graph_2':
            
            obj_date = datetime.datetime.strptime(dates_complete, '%Y-%m-%d')
            delta_week = (obj_date + datetime.timedelta(days=31))
            if delta_week <= obj_date:
                print(f'Зашло в условие')
            
                axes.set_xlabel("Дата прохождения теста")
                axes.set_ylabel("Точность %")
                axes.set_title("Прогресс пользователя")
                axes.plot(dates_complete[1], accuracy, marker='o')
                plt.savefig(buffer, format='png')

                buffer.seek(0)
                image_bytes = buffer.read()
                graph_to_html = base64.b64encode(image_bytes).decode('utf-8')
                buffer.close()

                return {
                    "scores": scores,
                    'graph': graph_to_html,
                    'list_tests': list_tests
                }
            
            else:
                message = 'Слишком мало данных для построения графика'
                return{'message': message}
            
        return {'message': message}
