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
    if current_user.is_authenticated:
        scores = Score.query.limit(4).all() # тут ошибка
        score = Score.query.filter_by(user_id = current_user.id).limit(4).all()
        test = Test.query.filter_by(id=scores[0].test_id).first()

        fig, axes = plt.subplots()
        buffer = io.BytesIO()
        accuracy = []
        dates_complete = []
        list_user_answers = []


        for index in scores:
            accuracy.append(index.accuracy)
            dates_complete.append(index.date_complete)
            list_user_answers.append(index.user_answer.split("%$№"))

        axes.plot(dates_complete[0], accuracy[0], marker='o')
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        image_bytes = buffer.read()
        graph_to_html = base64.b64encode(image_bytes).decode('utf-8')
        buffer.close()
        # print(type(html_str))

        return {
            'accuracy': accuracy,
            'name_test': test.title,
            'dates_complete': dates_complete,
            'list_user_answers': list_user_answers[0],
            'graph': graph_to_html
        }

    return {}