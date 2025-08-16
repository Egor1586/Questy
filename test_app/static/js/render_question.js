function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function renderWaiteQuestion() {
    const roomContent = document.getElementById("room-content");
    roomContent.className = 'blur-overlay'

    let waitСontent = document.createElement('div')
    waitСontent.className = 'wait-content'

    let waitingMessage = document.createElement('div')
    waitingMessage.className = 'waiting-message'
    waitingMessage.textContent = 'Будь ласка, зачекайте, поки інші учасники відповідають...'

    waitСontent.appendChild(waitingMessage)
    roomContent.appendChild(waitСontent)

    // roomContent.innerHTML = ""; 
    // roomContent.className = "wait-content"; 
    // roomContent.appendChild(waitingMessage)

    // blurOverlay.className = 'blur-overlay';
    // const blurOverlay = document.createElement('div')

    // roomContent.textContent= "Зачекайте на наступне питання..."
}

function renderQuestion(questionNumber, list_quiz, list_answers, room, author_name) {
    const roomContent = document.getElementById("room-content");

    console.log(questionNumber);

    if (roomContent != null) {
        roomContent.className = "question-content";
        roomContent.innerHTML = ""; 
    };

    const questionBlock = document.createElement("div");
    questionBlock.className = "question";

    const question = document.createElement("p");
    question.textContent = list_quiz[questionNumber].question_text;
    questionBlock.appendChild(question);

    const answersDiv = document.createElement("div");
    answersDiv.className = "answers";

    list_answers[questionNumber].forEach(answer => {
        const link = document.createElement("button");
        link.className = "passing-answer";
        link.id= `${answer}`;

        const answerDiv = document.createElement("div");
        answerDiv.className = "answer-div";
        answerDiv.id = answer;
        answerDiv.textContent = answer;

        link.appendChild(answerDiv);
        answersDiv.appendChild(link);
    });

    if (roomContent != null ) {
        roomContent.appendChild(questionBlock);
        roomContent.appendChild(answersDiv);
    }
    else if (questionContent) {
        questionContent.appendChild(question);
        questionContent.appendChild(answersDiv);
    };

    const arreyButton = document.querySelectorAll(".passing-answer")

    for (let count = 0; count < arreyButton.length; count++ ) {
        let button= arreyButton[count];
        button.addEventListener(
            type= "click" ,
            listener= function ( event ) {
                let cookie= getCookie("user_answers")
                let state= getCookie("state")
                document.cookie = `state= waite${state.slice(-1)}; path=/`;
                if (typeof cookie === "undefined"){
                    document.cookie = `user_answers= |${button.id}|; path = /`     
                }
                else{
                    cookie= cookie + `|${button.id}|`
                    document.cookie = `user_answers = ${cookie}; path= /`
                }   
                
                console.log(button.id)
                
                socket.emit("user_answer", {
                    room: room,
                    author_name: author_name,
                    username: username,
                    answer: button.id
                });
                
                renderWaiteQuestion();
            }
        )
    }
}
