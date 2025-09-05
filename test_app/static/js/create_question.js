const createQuestionButton = document.querySelector(".button-create-question");
const testQuestionDiv = document.querySelector(".test-question");

createQuestionButton.addEventListener('click', function() {
    console.log("create question")
    
    testQuestionDiv.innerHTML += 
            `<div class="question-block">
                <div class="question-header">
                    <span>Питання 1</span>
                    <button type="button" class="delete-question">Видалити питання?</button>
                </div>

                <label>Текст питання:</label>
                <input type="text" name="question-text">

                <div class="answers">
                    <label>Варіанти відповідей:</label>
                    <div class="answer-input">
                        <input type="text" placeholder="Відповідь 1">
                        <input type="radio" name="correct-answer-1"> Правильна
                    </div>
                </div>
                <button type="button" class="add-answer">Додати відповідь</button>
            </div>`
});

testQuestionDiv.addEventListener("click", function(event){
    if (event.target.classList.contains("delete-quiz")){
        event.target.closest(".question-block").remove(); 
    }

    if (event.target.classList.contains("add-answer")){
        questionBlock= event.target.closest(".question-block")
        questionText= questionBlock.querySelector(".question-text")
        questionText.innerHTML += `<div class="test-title">Відповідь: <input type="text" placeholder="Введіть відповідь"></div>`
    }
});
