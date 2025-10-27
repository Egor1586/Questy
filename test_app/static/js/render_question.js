function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function renderWaiteQuestion() {
    const roomContent = document.getElementById("room-content");
    roomContent.innerHTML = ""; 
    roomContent.className = 'waite-next-question'

    roomContent.innerHTML = `
        <div class="blur-overlay">
            <div class="wait-content">
                <div class="waiting-message">
                    Будь ласка, зачекайте, поки інші учасники відповідають...
                </div>
            </div>
        </div>
    `
    console.log("waite next question")
}

function renderQuestion(testId, quiz, answers, room, author_name) {
    const roomContent = document.getElementById("room-content");

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
    timer.textContent = quiz.time;
    questionBlock.appendChild(timer);
 
    const answersDiv = document.createElement("div");
    
    if (quiz.question_type == "input"){
        answersDiv.className = "answers-input";
    }
    else{
        answersDiv.className = "answers";
    }

    console.log(quiz.time)

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

                    renderWaiteQuestion();
                    
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
        console.log("input")
        
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
            let user_answer= getCookie("user_answers")
            let state= getCookie("state")
            let answerValue= document.querySelector(".input-with-answer").value

            document.cookie = `state= waite${state.slice(-1)}; path=/`;

            console.log(answerValue)

            if (typeof answerValue === "undefined"){
                answerValue= "not_answer"
            }
            
            if (typeof user_answer === "undefined"){
                document.cookie = `user_answers=|${answerValue}|; path = /`     
            }
            else{
                cookie= user_answer + `|${answerValue}|`
                document.cookie = `user_answers=${cookie}; path= /`
            }       

            renderWaiteQuestion();
                    
            socket.emit("user_answer", {
                room: room,
                author_name: author_name,
                username: username,
                answer: answerValue
            });
        })
    
    }
    else if (quiz.question_type == "multiple_choice"){
        console.log("multiple_choice")

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
                        console.log(button.textContent, "active-multiple-answer")
                    }
                    else{
                        button.className= "multiple-answer"
                        console.log(button.textContent, "multiple-answer")
                    }
                }
            )
        }

        multipleChoiceButton.addEventListener("click", function(event) {
            let user_answer= getCookie("user_answers")
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
            console.log(answerValue)

            if (typeof answerValue === "undefined"){
                answerValue= "not_answer"
            }
            
            if (typeof user_answer === "undefined"){
                document.cookie = `user_answers=${answerValue}; path = /`     
            }
            else{
                cookie= user_answer + `|${answerValue}|`
                document.cookie = `user_answers=${cookie}; path= /`
            }       

            renderWaiteQuestion();
                    
            socket.emit("user_answer", {
                room: room,
                author_name: author_name,
                username: username,
                answer: answerValue
            });
        })
    }


    const timerText= document.getElementById("timer")
    
    const coundown= setInterval(() =>{
        time= parseInt(timerText.textContent);
        timerText.textContent= --time;

        if (time <= 0){
            clearInterval(coundown);
            timerText.textContent = "Час закінчений"
        }

    }, 1000);
}
