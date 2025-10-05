const createQuestionButton = document.querySelector(".button-create-question");
const testQuestionDiv = document.querySelector(".test-question");

let countQuestion= 0;

createQuestionButton.addEventListener('click', function() {
    console.log("create question")
    countQuestion++;
    
    const questionHTML= 
            `<div class="question-block" id="q${countQuestion}">
                <div class="question-header">
                    <span>Питання ${countQuestion}</span>
                    <button type="button" class="delete-question">Видалити питання?</button>
                </div>

                <label>Текст питання:</label>
                <input type="text" class="question-text" name="question-text">

                <label>Час для виконання</label>
                <input type="text" class="question-time" name="question-time">

                <div class="answers">
                    <label>Варіанти відповідей:</label>
                    <div class="answer-input">
                        <input type="text" class="answer-text" placeholder="Відповідь 1">
                        <input type="radio" class="question-radio" name="correct-answer-q${countQuestion}"> Правильна
                    
                    </div>
                </div>
                <button type="button" class="add-answer">Додати відповідь</button>
            </div>`

    testQuestionDiv.insertAdjacentHTML("beforeend", questionHTML)
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
});
