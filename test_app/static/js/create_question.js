const createQuestionButtonDiv = document.querySelector(".create-question-block")
const testQuestion =document.querySelector(".test-question")

let countQuestion= 0;

const testQuestionDiv = document.querySelector(".container")

createQuestionButtonDiv.addEventListener('click', function(event) {
    const questionType= event.target.id
    console.log(questionType)

    countQuestion++;

    const choiceQuestion = `                
            <div class="answers" id="choice">
                <label>Варіанти відповідей:</label>
                <div class="answer-input">
                    <input type="text" class="answer-text" placeholder="Відповідь 1">
                    <input type="radio" class="question-radio" name="correct-answer-q${countQuestion}"> Правильна
                
                </div>
            </div>
            <button type="button" class="add-answer">Додати відповідь</button>
        `
    const inputQuestion = `                
            <div class="answers" id="input">
                <label>Варіанти відповідей:</label>
                <div class="answer-input">
                    <input type="text" class="answer-text" placeholder="Відповідь">
                </div>
            </div>
        `
    const multiChoiceQuestion = `                
            <div class="answers" id="multiple_choice">
                <label>Варіанти відповідей:</label>
                <div class="answer-input">
                    <input type="text" class="answer-text" placeholder="Відповідь 1">
                    <input type="checkbox" class="checkbox" name="correct-answer-q${countQuestion}"> Правильна
                
                </div>
            </div>
            <button type="button" class="add-mutlti-answer">Додати відповідь</button>
        `
    const imageQuestion = `                
        <div class="answers" id="image">
            <label>Варіанти відповідей:</label>
            <div class="answer-input">
                <input type="text" class="answer-text" placeholder="Відповідь 1">
                <input type="radio" class="question-radio" name="correct-answer-q${countQuestion}"> Правильна
            
            </div>
        </div>
        <button type="button" class="add-answer">Додати відповідь</button>
    `

    let questionHTML= 
            `<div class="question-block" id="q${countQuestion}">
                <div class="question-header">
                    <span>Питання ${countQuestion}</span>
                    <button type="button" class="delete-question">Видалити питання?</button>
                </div>

                <label>Текст питання:</label>
                <input type="text" class="question-text" name="question-text">

                <label>Час для виконання</label>
                <input type="text" class="question-time" name="question-time">
            `


    if (questionType == "choice"){
        questionHTML += (choiceQuestion)
    }
    else if (questionType == "input"){
        questionHTML += (inputQuestion)
    }
    else if (questionType == "multiple-choice"){
        questionHTML += (multiChoiceQuestion)
    }
    else if (questionType == "image"){
        questionHTML += (imageQuestion)
    }
    questionHTML += "</div>"

    testQuestion.insertAdjacentHTML("beforeend", questionHTML)
});

testQuestionDiv.addEventListener("click", function(event){
    if (event.target.classList.contains("delete-question")){
        console.log("delete")
        event.target.closest(".question-block").remove(); 
    }

    if (event.target.classList.contains("add-answer")){
        const questionBlock= event.target.closest(".question-block")
        const answersBlock= questionBlock.querySelector(".answers")
        const blockId = questionBlock.id
        const answerCount= answersBlock.querySelectorAll(".answer-input").length + 1
        
        let newAnswer= document.createElement("div")
        newAnswer.className= "answer-input"
        newAnswer.innerHTML= `
                            <input type="text" class="answer-text" placeholder="Відповідь ${answerCount}">
                            <input type="radio" class="question-radio" name="correct-answer-${blockId}"> Правильна`

        answersBlock.appendChild(newAnswer)
    }
    if (event.target.classList.contains("add-mutlti-answer")){
        const questionBlock= event.target.closest(".question-block")
        const answersBlock= questionBlock.querySelector(".answers")
        const blockId = questionBlock.id
        const answerCountMulti= answersBlock.querySelectorAll(".answer-input").length + 1
        
        let newAnswer= document.createElement("div")
        newAnswer.className= "answer-input"
        newAnswer.innerHTML= `
                            <input type="text" class="answer-text" placeholder="Відповідь ${answerCountMulti}">
                            <input type="checkbox" class="checkbox" name="correct-answer-${blockId}"> Правильна`

        answersBlock.appendChild(newAnswer)
    }
});
