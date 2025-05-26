import flask
import matplotlib.pyplot as plt
import io
import base64

from flask_login import current_user

from Project.render_page import render_page
from auth.models import Score
from test_app.models import Test


@render_page(template_name='score.html')
def render_score():
    fig, axes = plt.subplots()
    buffer = io.BytesIO()
    accuracy = []
    dates_complete = []
    list_user_answers = []
    message = 'Вы не авторизованы'

    if current_user.is_authenticated:

        scores = Score.query.filter_by(user_id = 1).limit(4).all()
        test = Test.query.filter_by(id=scores[0].test_id).first()

        for index in scores:
            accuracy.append(index.accuracy)
            dates_complete.append(index.date_complete)
            list_user_answers.append(index.user_answer.split("%$№"))
        print(f'Это аккуратность: {accuracy}')
        accuracy[2] = 150
        accuracy[3] = 1000
        dates_complete[2] = '2025-01-30'
        dates_complete[1] = '2025-01-25'
        dates_complete[-1] = '2025-02-02'
        if dates_complete[0] == dates_complete[-1]:
            message = 'Слишком мало данных для построения графика'
            return {'message': message}

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
            'accuracy': accuracy,
            'name_test': test.title,
            'dates_complete': dates_complete,
            'list_user_answers': list_user_answers[0],
            'graph': graph_to_html
        }

    return {'message': message}