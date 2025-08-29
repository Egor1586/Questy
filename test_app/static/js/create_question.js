const createQuestionButton = document.querySelector(".button-create-question");
const questionDiv = document.querySelector(".test-question");
const testQuestionDiv = document.querySelector(".test-question");

createQuestionButton.addEventListener('click', function() {
    console.log("create question")
    
    testQuestionDiv.innerHTML += 
            `<div class="question-block">
                <div class="question-header">
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
    if (event.target.classList.contains("delete-quiz")){
        event.target.closest(".question-block").remove(); 
    }

    if (event.target.classList.contains("add-answer")){
        questionBlock= event.target.closest(".question-block")
        questionText= questionBlock.querySelector(".question-text")
        questionText.innerHTML += `<div class="test-title">Відповідь: <input type="text" placeholder="Введіть відповідь"></div>`
    }
});
