function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function renderWaiteQuestion(type) {
    console.log("WAIRTE DEL TIME")
    const roomContent = document.getElementById("room-content");
    document.cookie= "time=; max_age=0; path=/"
    roomContent.innerHTML = ""; 
    roomContent.className = 'waite-next-question'

    let leaveButton= ""
    if (type === "waite"){
        leaveButton= `<button class='leave-test' onclick="leaveTest()">Відключитися від тесту</button>`
    }
    roomContent.innerHTML = `
        <div class="blur-overlay">
            <div class="wait-content">
                <div class="waiting-message">
                    Будь ласка, зачекайте, поки інші учасники відповідають...
                    ${leaveButton}
                </div>
            </div>
        </div>
    `
}

function renderQuestion(testId, quiz, answers, room, author_name) {
    const roomContent = document.getElementById("room-content");
    let quizTime= getCookie("time");

    if (isNaN(quizTime) || quizTime <= 0){
        renderWaiteQuestion("test")
    }

    if (roomContent != null) {
        roomContent.className = "question-content";
        roomContent.innerHTML = ""; 
    };

    const questionBlock = document.createElement("div");
    questionBlock.className = "question";

    const question = document.createElement("p");
    question.textContent = quiz.question_text;
    questionBlock.appendChild(question);

    const timer = document.createElement("p");
    timer.id= "timer"
    timer.textContent = quizTime;
    questionBlock.appendChild(timer);
 
    const answersDiv = document.createElement("div");
    
    if (quiz.question_type == "input"){
        answersDiv.className = "answers-input";
    }
    else{
        answersDiv.className = "answers";
    }

    if (quiz.question_type == "choice" || quiz.question_type == "image"){

        answers.forEach(answer => {
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

            if (quiz.question_type == "image"){
                const imageDiv = document.createElement("div");
                imageDiv.className = "image-div";

                const image = document.createElement("img");
                image.src = `/test_app/static/images/${testId}/${quiz.image_name}`;
                image.alt= "quiz image";

                imageDiv.appendChild(image)
                roomContent.appendChild(imageDiv)
            }
            
            roomContent.appendChild(answersDiv);
        }

        const arreyButton = document.querySelectorAll(".passing-answer")

        for (let count = 0; count < arreyButton.length; count++ ) {
            let button= arreyButton[count];
            button.addEventListener(
                type= "click" ,
                listener= function ( event ) {
                    let cookie= getCookie("userAnswers")
                    let state= getCookie("state")
                    document.cookie = `state= waite${state.slice(-1)}; path=/`;
                    
                    if (typeof cookie === "undefined"){
                        document.cookie = `userAnswers= |${button.id}|; path = /`     
                    }
                    else{
                        cookie= cookie + `|${button.id}|`
                        document.cookie = `userAnswers = ${cookie}; path= /`
                    }   

                    renderWaiteQuestion("test");
                    
                    socket.emit("user_answer", {
                        room: room,
                        author_name: author_name,
                        username: username,
                        answer: button.id
                    });
                }
            )
        }
    }
    else if (quiz.question_type == "input"){        
        const inputAnswer = document.createElement("input");
        inputAnswer.placeholder = "Введіть відповідь на запитання";
        inputAnswer.type = "text";
        inputAnswer.className = "input-with-answer";

        const inputButton = document.createElement("button");
        inputButton.className= "multiple-choice-answer"
        inputButton.textContent= "Відповісти на питання"

        answersDiv.appendChild(inputAnswer)

        if (roomContent != null ) {
            roomContent.appendChild(questionBlock);
            roomContent.appendChild(answersDiv);
            roomContent.appendChild(inputButton);
        }
        
        inputButton.addEventListener("click", function(event) {
            let user_answer= getCookie("userAnswers")
            let state= getCookie("state")
            let answerValue= document.querySelector(".input-with-answer").value

            document.cookie = `state= waite${state.slice(-1)}; path=/`;

            if (typeof answerValue === "undefined"){
                answerValue= "not_answer"
            }
            
            if (typeof user_answer === "undefined"){
                document.cookie = `userAnswers=|${answerValue}|; path = /`     
            }
            else{
                cookie= user_answer + `|${answerValue}|`
                document.cookie = `userAnswers=${cookie}; path= /`
            }       

            renderWaiteQuestion("test");
                    
            socket.emit("user_answer", {
                room: room,
                author_name: author_name,
                username: username,
                answer: answerValue
            });
        })
    
    }
    else if (quiz.question_type == "multiple_choice"){
        answers.forEach(answer => {
            const answerDiv = document.createElement("div");
            answerDiv.className = "multiple-div";

            const answerButton = document.createElement("button");
            answerButton.className = "multiple-answer";
            answerButton.id = answer;
            answerButton.textContent = answer;

            answerDiv.appendChild(answerButton);
            answersDiv.appendChild(answerDiv);
        });

        const answerButton = document.createElement("button");
        answerButton.className = "multiple-choice-answer";
        answerButton.textContent = "Відповісти на запитання";

        if (roomContent != null ) { 
            roomContent.appendChild(questionBlock);
            roomContent.appendChild(answersDiv);
            roomContent.appendChild(answerButton);
        }

        const multipleChoiceButton = document.querySelector(".multiple-choice-answer")
        const arreyMultipleChoiceButton = document.querySelectorAll(".multiple-answer")

        for (let count = 0; count < arreyMultipleChoiceButton.length; count++ ) {
            let button= arreyMultipleChoiceButton[count];
            
            button.addEventListener(
                type= "click" ,
                listener= function ( event ) {
                    if (button.className == "multiple-answer"){
                        button.className= "active-multiple-answer"
                    }
                    else{
                        button.className= "multiple-answer"
                    }
                }
            )
        }

        multipleChoiceButton.addEventListener("click", function(event) {
            let user_answer= getCookie("userAnswers")
            let state= getCookie("state")
            let answerValue= ""
            let arreyUserMultipleChoice= document.querySelectorAll(".active-multiple-answer")

            for (const button of arreyUserMultipleChoice){
                if (!answerValue){
                    answerValue += button.id
                }
                else{
                    answerValue += "$$$" + button.id
                }
            }

            document.cookie = `state= waite${state.slice(-1)}; path=/`;

            if (typeof answerValue === "undefined"){
                answerValue= "not_answer"
            }
            
            if (typeof user_answer === "undefined"){
                document.cookie = `userAnswers=${answerValue}; path = /`     
            }
            else{
                cookie= user_answer + `|${answerValue}|`
                document.cookie = `userAnswers=${cookie}; path= /`
            }       

            renderWaiteQuestion("test");
                    
            socket.emit("user_answer", {
                room: room,
                author_name: author_name,
                username: username,
                answer: answerValue
            });
        })
    }

    startTimer()
}
