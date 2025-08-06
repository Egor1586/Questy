function addUserAnswer(username, answer) {
    console.log("add user answer")
    const userAnswers = document.getElementById("user-answers");
    
    userAnswers.innerHTML += `
        <div class="user-answer">
            <div class="user-name">${username}</div>
            <div class="answer-text">${answer}</div>
        </div>
    `

}

function stopTest(){
    console.log("stop test")

    socket.emit("stop_test", {
        room: room,
        author_name: author_name
    });

    document.cookie = `state= author_result_test; path=/`;
    console.log(`Stop test ${getCookie("state")}`);

    renderAuthorResultTest(username, author_name, total_question);
}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function renderAuthorStart(quiz, answers, room, authorname, state, total_question) {
    const waiteContent = document.getElementById("room-content");
    waiteContent.innerHTML = ""; 
    waiteContent.id = 'container-question'
    waiteContent.className = 'container-question'

    // Верхній блок
    // const containerQuestion = document.createElement('div')
    // containerQuestion.className = 'container-question'
    // containerQuestion.id= 'container-question'

    // Нижній контейнер
    const headerBar = document.createElement('div')
    headerBar.className = 'header-bar'

    const question = document.createElement('div')
    question.id = 'author-question'
    question.className = 'author-question'
    question.textContent= `Питання: ${quiz.question_text}`

    const correct_answer = document.createElement('div')
    correct_answer.id = 'author-correct-answer'
    correct_answer.className = 'author-correct-answer'
    correct_answer.textContent= `Правильна відповідь: ${quiz.correct_answer}`

    const nextButton = document.createElement('button')
    nextButton.id = 'next-q'
    nextButton.className = 'next-q'
    nextButton.textContent = 'Наступне питання'
    nextButton.addEventListener("click", nextQuestion);

    headerBar.appendChild(question)
    headerBar.appendChild(correct_answer)
    headerBar.appendChild(nextButton)
    
    waiteContent.appendChild(headerBar)

    const userAnswers = document.createElement('div')
    userAnswers.id = 'user-answers'
    userAnswers.className = 'user-answers'

    waiteContent.appendChild(userAnswers)
    
    // const question_text = document.createElement('div')
    // question_text.id = "question-text"
    // question_text.textContent = `Питання:${quiz.question_text}`

    // const correct_answer = document.createElement('div')
    // correct_answer.id = "correct-answer"
    // correct_answer.textContent = `Правильна відповідь: ${quiz.correct_answer}`

    // block2.appendChild(question_text)
    // block2.appendChild(correct_answer)

    // // Блок статистики
    // const block3 = document.createElement('div')
    // block3.className = 'block3'
    // block3.textContent = 'Статистика відповідей'

    // bottomContainer.appendChild(block2)
    // bottomContainer.appendChild(block3)

    // // Кнопка "Наступне питання"
    // const nextButton = document.createElement('button')
    // nextButton.id = 'next-button'
    // nextButton.className = 'next-button'
    // nextButton.textContent = 'Наступне питання'
    // nextButton.addEventListener("click", nextQuestion);


    // // Збірка
    // waiteContent.appendChild(block1)
    // waiteContent.appendChild(bottomContainer)
    // waiteContent.appendChild(nextButton)

    socket.emit("get_usernames", {
        room: room,
        authorname: authorname
    });

    // socket.on('get_usernames', function(data){
    //     let userArrey = data;
    //     lengthArrey = userArrey.length
    //     block3.innerHTML = `<div><strong>Список пользователей:</strong>${data}<div>
    //                         <div><strong>Всего пользователей:</strong> ${lengthArrey}</div>                                               
    //                         `
    // })
}
