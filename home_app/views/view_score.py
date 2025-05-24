import flask
import matplotlib.pyplot as plt
import mpld3

from flask_login import current_user

from Project.render_page import render_page
from auth.models import Score
from test_app.models import Test


@render_page(template_name='score.html')
def render_score():
    if current_user.is_authenticated:
        scores = Score.query.limit(4).all() # тут ошибка
        test = Test.query.filter_by(id=scores[0].test_id).first()

        # figure, axes = plt.subplots()

        accuracy = []
        dates_complete = []
        list_user_answers = []



        for index in scores:
            accuracy.append(index.accuracy)
            dates_complete.append(index.date_complete)
            list_user_answers.append(index.user_answer.split("%$№"))
        

        print(f'Это список ответов: {list_user_answers}')
        # axes.plot(dates_complete, accuracies, marker='o')
        # html_str = mpld3.fig_to_html(figure)
        # print(type(html_str))

        return {
            'accuracy': accuracy,
            'name_test': test.title,
            'dates_complete': dates_complete,
            'list_user_answers': list_user_answers[0],
            # 'graphs': html_str
        }

    return {}
