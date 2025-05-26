import flask
import matplotlib.pyplot as plt
import io
import base64

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
    message = 'Вы не авторизованы'
    list_tests = []

    if current_user.is_authenticated:
        scores = Score.query.filter_by(user_id= current_user.id).all()

        for score in scores:
            accuracy.append(score.accuracy)
            dates_complete.append(score.date_complete)
            if Test.query.filter_by(id= score.test_id).first() not in list_tests:
                list_tests.append(Test.query.filter_by(id= score.test_id).first())


        # print(f'Это аккуратность: {accuracy}')
        # accuracy[2] = 150
        # accuracy[3] = 1000
        # dates_complete[2] = '2025-01-30'
        # dates_complete[1] = '2025-01-25'
        # dates_complete[-1] = '2025-02-02'
        
        # if False:
        #     message = 'Слишком мало данных для построения графика'
            
        #     return {
        #         'message': message,
        #         'accuracy': accuracy,
        #         'test': test,
        #         'dates_complete': dates_complete,
        #         'list_user_answers': list_user_answers[0],
        #         'lists_tests': list_tests
        #         }

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

    return {'message': message}
