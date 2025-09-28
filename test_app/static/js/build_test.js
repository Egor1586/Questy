const contaiter = document.querySelector(".container");

function buildTest(){
    data = {
        "topic": "",
        "description": "",
        "questions": [
            {
                "question_text": "",
                "options": [
                    ""
                ],
                "correct_answer": "",
                "time": 0
            }
        ]
    }

    data["description"] = document.getElementById("test-description").value;
    data["topic"] = document.getElementById("test-title").value;

    console.log("build test test")
    console.log(data)
}

contaiter.addEventListener("click", function(event){
    if (event.target.classList.contains("submit-button")){
        buildTest()
    }
});