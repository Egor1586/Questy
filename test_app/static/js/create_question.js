const createQuestionButton = document.querySelector(".button-create-quesion");
const testQuestionDiv = document.querySelector(".test-question");

createQuestionButton.addEventListener('click', function() {
    console.log("create question")
    
    testQuestionDiv.innerHTML += `
            <div class="question-block">
                <input type="text" placeholder="-">
                <input type="text" placeholder="+">
            </div>`
});
