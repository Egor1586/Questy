const createQuestionButton = document.querySelector(".button-create-question");
<<<<<<< HEAD
const questionDiv = document.querySelector(".test-question");
=======

>>>>>>> a588940606dcbcc2c774722489872e51750c39f3
const testQuestionDiv = document.querySelector(".test-question");

createQuestionButton.addEventListener('click', function() {
    console.log("create question")
    
    testQuestionDiv.innerHTML += 
            `<div class="question-block">
                <div class="question-header">
<<<<<<< HEAD
                    <div class="test-title">Введіть запитання: <input type="text" placeholder="Введіть питання"></div>
                </div>
                
                <button class="delete-quiz">Видалити питання?</button>

                <div class="question-text">
                    <div class="test-title">Правильна відповідь: <input type="text" placeholder="Введіть правильну відповідь"></div>
                    <div class="test-title">Відповідь: <input type="text" placeholder="Введіть відповідь"></div>
                </div>  
                
                <button class="add-answer">+ відповідь</button>
            </div>`
});

questionDiv.addEventListener("click", function(event){
=======
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
>>>>>>> a588940606dcbcc2c774722489872e51750c39f3
    if (event.target.classList.contains("delete-quiz")){
        event.target.closest(".question-block").remove(); 
    }

    if (event.target.classList.contains("add-answer")){
        questionBlock= event.target.closest(".question-block")
        questionText= questionBlock.querySelector(".question-text")
        questionText.innerHTML += `<div class="test-title">Відповідь: <input type="text" placeholder="Введіть відповідь"></div>`
    }
});
