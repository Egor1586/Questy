const createQuestionButton = document.querySelector(".button-create-question");
const testQuestionDiv = document.querySelector(".test-question");

createQuestionButton.addEventListener('click', function() {
    console.log("create question")
    
    testQuestionDiv.innerHTML += 
            `<div class="question-block">
                <div class="question-header">
                    <input type="text" placeholder="Введіть питання">
                </div>
                
                <form action="/delete_quiz6">
                    <button class="delete_quiz">Видалити питання?</button>
                </form>

                <div class="question-text">
                    Виберіть правильний варіант.
                </div>      
                
                <div class="question-text">
                    <div class="test-title">Правильна відповідь: <input type="text" placeholder="Введіть правильну відповідь"></div>
                    <div class="test-title">Відповідь: <input type="text" placeholder="Введіть відповідь"></div>
                </div>  
                
                <button>+ відповідь</button>
            </div>`
});
