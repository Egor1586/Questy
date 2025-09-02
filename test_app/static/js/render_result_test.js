function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function userLeaveTest() {
  document.cookie = `state=; max-age=0; path=/;`;
  document.cookie = `user_answers=; max-age=0; path=/;`;
  document.cookie = `countUsersAnswer=; max-age=0; path=/;`;
  document.cookie = `temporary_name=; max-age=0; path=/;`;

  window.location.href = '/';
}

function renderResultTest(username, author_name, total_question, answers_per_question, list_quiz, list_answers) {
  let answersStr = getCookie("user_answers");
  let answers_list = answersStr.split("|");
  let user_answers = [];
  let answersArrey = [];

  for (let answer of answers_list) {
    if (answer != "|") {
      user_answers.push(answer);
    }
  }
  for (let answer of user_answers) {
    if (answer != "") {
      answersArrey.push(answer);
    }
  }

  let correctAnswer = 0;

  for (let count = 0; count < list_quiz.length; count++) {
    if (list_quiz[count].correct_answer === answersArrey[count]) {
      correctAnswer++;
    }
  }

  let accuracy = (correctAnswer / total_question) * 100;

  const resultContainer = document.getElementById("room-content");
  resultContainer.innerHTML = "";
  resultContainer.id = 'results-container';
  resultContainer.className = 'results-container';

  const resultInfo = document.createElement('div');
  resultInfo.className = 'result-info';

  const testInfo = document.createElement('div');
  testInfo.className = 'text-info';

  const info1 = document.createElement('p');
  info1.innerHTML = `<strong>${username}</strong> ваш результат: <strong>${correctAnswer}</strong> з ${total_question}`;

  const info2 = document.createElement('p');
  info2.innerHTML = `Точність правильних відповідей: <strong>${accuracy.toFixed(1)}%</strong>`;

  const leaveLink = document.createElement('a');
  leaveLink.className = 'home-link';

  const leaveButton = document.createElement('button');
  leaveButton.className = 'home-btn';
  leaveButton.textContent = 'Покинути тест';
  leaveButton.addEventListener("click", userLeaveTest);

  testInfo.appendChild(info1);
  testInfo.appendChild(info2);
  leaveLink.appendChild(leaveButton);
  testInfo.appendChild(leaveButton);

  resultInfo.appendChild(testInfo);

  const answerInfo = document.createElement('div');
  answerInfo.className = 'answer-info';
  answerInfo.innerHTML = `
      <ul>
        <li><span class="color-dot color-green"></span>Правильна відповідь (зелений)</li>
        <li><span class="color-dot color-yellow"></span>Ваша неправильна відповідь (жовтий)</li>
        <li><span class="color-dot color-red"></span>Неправильна відповідь (червоний)</li>
      </ul>
  `;

  resultInfo.appendChild(answerInfo);
  resultContainer.appendChild(resultInfo);

  const chartWrapper = document.createElement('div');
  chartWrapper.className = 'chart-wrapper';

  const chartCanvas = document.createElement('canvas');
  chartCanvas.id = 'myChart';
  chartCanvas.width = 400;
  chartCanvas.height = 200;

  chartWrapper.appendChild(chartCanvas);
  resultContainer.appendChild(chartWrapper);

  const ctx = chartCanvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Правильні відповіді', 'Усього питань'],
      datasets: [{
        label: 'Результат',
        data: [correctAnswer, total_question - correctAnswer],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  for (let quiz_number = 0; quiz_number < total_question; quiz_number++) {
    const questionBlock = document.createElement('div');
    questionBlock.className = 'question-block';

    const questionHeader = document.createElement('div');
    questionHeader.className = 'question-header';

    const question = document.createElement('div');
    question.textContent = `${list_quiz[quiz_number].question_text}`;
    questionHeader.appendChild(question);

    questionBlock.appendChild(questionHeader);

    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionBlock.appendChild(questionText);

    for (let answer_number = 0; answer_number < list_answers[quiz_number].length; answer_number++) {
      const answerText = list_answers[quiz_number][answer_number];

      if (
        answerText !== list_quiz[quiz_number].correct_answer &&
        answerText !== answersArrey[quiz_number]
      ) {
        const answerIncorrect = document.createElement('div');
        answerIncorrect.className = 'answer incorrect';
        answerIncorrect.textContent = `✗ ${answerText}`;
        questionBlock.appendChild(answerIncorrect);
      } else if (
        answersArrey[quiz_number] !== list_quiz[quiz_number].correct_answer &&
        answerText === answersArrey[quiz_number]
      ) {
        const answerUserAnswers = document.createElement('div');
        answerUserAnswers.className = 'answer user_answers';
        answerUserAnswers.textContent = `✗ ${answerText}`;
        questionBlock.appendChild(answerUserAnswers);
      } else {
        const answerCorrect = document.createElement('div');
        answerCorrect.className = 'answer correct';
        answerCorrect.textContent = `✓ ${answerText}`;
        questionBlock.appendChild(answerCorrect);
      }
    }

    resultContainer.appendChild(questionBlock);
  }
}

