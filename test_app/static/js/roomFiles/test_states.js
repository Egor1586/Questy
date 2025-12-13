function testStop(){    
    socket.emit("stop_test", {
        room: room,
        author_name: authorName
    });

    setCookie("state", "authorResultTest")
    renderAuthorResultTest(username, authorName, totalQuestion);
}

function authorStartTest() {
    let userList= getCookie("userList")
    if (userList){
        socket.emit("author_start_test", {
            room: room,
        });
    }
}

function nextQuestion(){
    const nextButton = document.getElementById("next-q");

    state = getCookie("state");
    let numberOfQuestion= Number(state.slice(-1)) + 1;
    // let countUsersAnswer= getCookie("countUsersAnswer");
    
    setCookie("timeStop", "false") 

    const userAnswers = document.getElementById("user-answers");
    userAnswers.innerHTML = ""

    const countAnswer = document.getElementById("count-answer-span");
    countAnswer.textContent= 0;
    
    setCookie("state", `authorStart${numberOfQuestion}`)
    setCookie("countCorrectAnswer", 0)

    if (numberOfQuestion == totalQuestion- 1) {
        nextButton.textContent = 'Кінець тесту'
        nextButton.removeEventListener("click", nextQuestion)
        nextButton.addEventListener("click", testStop);
    }
    
    if (donatChart){
        donatChart.destroy()
    }

    if (!listQuiz[numberOfQuestion]){
        return
    }

    setCookie("countUsersAnswer", 0)
    
    const question_text = document.getElementById("author-question")
    question_text.textContent = `${listQuiz[numberOfQuestion].question_text}`

    const correct_answer = document.getElementById("author-correct-answer")

    if (listQuiz[numberOfQuestion].question_type == "multiple_choice"){
        correct_answer.textContent= `${listQuiz[numberOfQuestion].correct_answer.replace("%$№", " та ")}`
    }
    else{
        correct_answer.textContent= `${listQuiz[numberOfQuestion].correct_answer}`
    }

    setCookie("time", Number(listQuiz[numberOfQuestion].time))
    resetTimer(Number(listQuiz[numberOfQuestion].time))

    const newTime = document.getElementById("timer")
    newTime.textContent =`${listQuiz[numberOfQuestion].time}`

    timerPaused= false
    plusAnswerTime= 0
    
    socket.emit("next_question", {
        room: room,
        author_name: authorName
    });
}

function checkAnswers(){
    state = getCookie("state");
    let token= 0
    const questionIndex= Number(state.slice(-1))

    let answers = getCookie("userAnswers") || ""
    let userTimers= getCookie("userTimers") || ""
    let userTokens= getCookie("userTokens") || ""

    const curTime= Number(getCookie("time")) || 0
    const allTime= plusAnswerTime+ listQuiz[Number(state.slice(-1))].time
    const userTimer= allTime -curTime
    
    let answerList= answers.split("|")
    answerList= answerList.filter(answer => answer && answer !== " ")

    const missingCount= 1 + questionIndex- answerList.length

    for (let miss = 0; miss < missingCount; miss++) {
        answers += "|not_answer|";
        userTimers += `|${userTimer}`;
        userTokens += `|${token}`;
    }

    console.log("checkANSWER")
    console.log(missingCount, answers, userTimers, userTokens)

    setCookie("userAnswers", answers)
    setCookie("userTimers", userTimers)
    setCookie("userTokens", userTokens)
}

function sendMessage() {
    let msgInput = document.getElementById("msg");
    let messages = document.getElementById("messages");
    let message = msgInput.value;

    if (message != ""){
        let messages = document.getElementById("messages");

        messages.innerHTML += `<p class="my-msg">${username}: ${msgInput.value}</p>`;  

        if (messages && messages.children.length != 1){
            const emptyMessages= document.getElementById("no-messages");
            if (emptyMessages){
                emptyMessages.remove()
            }
        }

        socket.emit("message_to_chat", {
            message: message,
            room: room,         
            username: username  
        });
    }
    msgInput.value = "";
}