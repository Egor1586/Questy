import flask
import matplotlib.pyplot as plt
import io
import base64
import datetime
import pandas as pd
import mplcyberpunk

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
    message = ' '
    scores= None
    list_tests = []
    selected_option = ['0']

    if current_user.is_authenticated:
        scores = Score.query.filter_by(user_id= current_user.id).all()
        for score in scores:
            accuracy.append(score.accuracy)
            dates_complete.append(score.date_complete)
            if Test.query.filter_by(id= score.test_id).first() not in list_tests:
                list_tests.append(Test.query.filter_by(id= score.test_id).first())
        
        if flask.request.method == 'POST':
            selected_option[0] = (flask.request.form.get('choice'))
            print(selected_option)

    
        dates_complete.sort()

        if selected_option[0] == 'graph_1':
            dates_complete = ['2025-07-20', '2025-07-21', '2025-07-22']
            accuracy = [13, 25, 60]

            data = {
                'Dates': dates_complete,
                'Accuracy': accuracy
            }

            df = pd.DataFrame(data)

            with plt.style.context('cyberpunk'):
                ax = df.plot(
                    x='Dates', y='Accuracy',
                    kind='line',
                    lw=3, marker='o', ms=10,
                    figsize=(10, 6)
                )
                fig.patch.set_facecolor('#0f0f0f')
                mplcyberpunk.add_gradient_fill(alpha_gradientglow=0.4)
                plt.xlabel('Дата проходження тесту')
                plt.ylabel('Точність %')
                plt.title('Прогрес користувача')
                plt.tight_layout()
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
            
            obj_date = datetime.datetime.strptime(dates_complete[0], '%Y-%m-%d')
            delta_week = (obj_date + datetime.timedelta(days=7))
            if delta_week >= obj_date:

                axes.set_xlabel("Дата проходження тесту")
                axes.set_ylabel("Точність %")
                axes.set_title("Прогрес користувача")
                dates_complete.sort()
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
            
            else:
                message = 'Занадто мало даних для побудови графіка'
                return{'message': message}

        elif selected_option[0] == 'graph_3':
            
            obj_date = datetime.datetime.strptime(dates_complete[0], '%Y-%m-%d')
            delta_week = (obj_date + datetime.timedelta(days=31))
            if delta_week <= obj_date:

                axes.set_xlabel("Дата проходження тесту")
                axes.set_ylabel("Точність %")
                axes.set_title("Прогрес користувача")
                dates_complete.sort()
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
                
            else:
                message = 'Занадто мало даних для побудови графіка'
                return{
                    "scores": scores,
                    'message': message,
                    'list_tests': list_tests
                    }
    
    else:
        message = "Ви не авторизовані"


    return {
        "scores": scores,
        'message': message,
        'list_tests': list_tests
        }