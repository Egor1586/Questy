function addUserAnswer(username, answer) {
    console.log("add user answer")
    const block1 = document.getElementById("block1");

    const userAnswerBlock = document.createElement('div')
    userAnswerBlock.className = 'user-answer-block'
    
    userAnswerBlock.innerHTML += `
        <div><strong>Ім’я:</strong> ${username}</div>
        <div><strong>Відповідь:</strong> ${answer}</div>
    `

    block1.appendChild(userAnswerBlock)
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
    nextButton.id = 'next-button'
    nextButton.className = 'next-button'
    nextButton.textContent = 'Наступне питання'
    nextButton.addEventListener("click", nextQuestion);


    // Збірка
    waiteContent.appendChild(block1)
    waiteContent.appendChild(bottomContainer)
    waiteContent.appendChild(nextButton)

    socket.emit("get_usernames", {
        room: room,
        authorname: authorname
    });

    socket.on('get_usernames', function(data){
        let userArrey = data;
        lengthArrey = userArrey.length
        block3.innerHTML = `<div><strong>Список пользователей:</strong>${data}<div>
                            <div><strong>Всего пользователей:</strong> ${lengthArrey}</div>                                               
                            `
    })
}
