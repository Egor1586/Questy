function addUserAnswer(username, answer) {
    console.log("add user answer")
    const block1 = document.getElementById("block1");
    block1.innerHTML += `
        <div><strong>Ім’я:</strong> ${username}</div>
        <div><strong>Відповідь:</strong> ${answer}</div>
    `
}

function renderAuthorStart(quiz, answers) {
    const waiteContent = document.getElementById("room-content");
    waiteContent.innerHTML = ""; 
    waiteContent.className = 'author-content'

    // Верхній блок
    const block1 = document.createElement('div')
    block1.className = 'block1'
    block1.id= 'block1'

    // Нижній контейнер
    const bottomContainer = document.createElement('div')
    bottomContainer.className = 'bottom-container'

    // Блок про питання
    const block2 = document.createElement('div')
    block2.className = 'block2'

    const question_text = document.createElement('div')
    question_text.id = "question-text"
    question_text.textContent = `Питання:${quiz.question_text}`

    const correct_answer = document.createElement('div')
    correct_answer.id = "correct-answer"
    correct_answer.textContent = `Правильна відповідь: ${quiz.correct_answer}`

    block2.appendChild(question_text)
    block2.appendChild(correct_answer)
    // Блок статистики
    const block3 = document.createElement('div')
    block3.className = 'block3'
    block3.textContent = 'Статистика відповідей'

    bottomContainer.appendChild(block2)
    bottomContainer.appendChild(block3)

    // Кнопка "Наступне питання"
    const nextButton = document.createElement('button')
    nextButton.className = 'next-button'
    nextButton.textContent = 'Наступне питання'
    nextButton.addEventListener("click", nextQuestion);

    // Збірка
    waiteContent.appendChild(block1)
    waiteContent.appendChild(bottomContainer)
    waiteContent.appendChild(nextButton)
}