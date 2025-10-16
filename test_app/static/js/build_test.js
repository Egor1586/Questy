function buildTest(){
    data = {
        "topic": "",
        "description": "",
        "questions": [

        ]       
    }


    data["description"] = document.getElementById("test-description").value;
    data["topic"] = document.getElementById("test-title").value;

    console.log("build test test")
    
    let flagError = false
    let messageError = ""

    let arrayQuestionBlock = document.querySelectorAll(".question-block") 
    arrayQuestionBlock.forEach(questionBlock => {
        let questionData= {
            "question_type": "",
            "question_text": "",
            "options": [],
            "correct_answer": "",
            "time": 0
            }
        let questionInformation= questionData
        
       
        let answerRadioFlag = false
        let countAnswers = 0
        let correctData = ""


        let questionText = questionBlock.querySelector(".question-text")
        let questionTime = questionBlock.querySelector(".question-time")

        if (questionText.value != "" && questionTime.value > 0 ){
            questionInformation["question_text"]= questionText.value
            questionInformation["time"] = parseInt(questionTime.value)
            questionInformation["question_type"] = questionBlock.querySelector(".answers").id

            if (data["description"] != "" && data["topic"] != ""){
            let arrayAnswersInput = questionBlock.querySelector(".answers").querySelectorAll(".answer-input")
            arrayAnswersInput.forEach(answerInput => {
                console.log(questionBlock.querySelector(".answers").id)
                if(questionBlock.querySelector(".answers").id == "choice"){
                    
                    let answerText = answerInput.querySelector(".answer-text")
                    let answerRadio = answerInput.querySelector(".question-radio")
                    
                    if (answerText.value != ""){
                        questionInformation["options"].push(answerText.value)
                        countAnswers = countAnswers + 1

                        if (answerRadio.checked){
                            questionInformation["correct_answer"] = answerText.value
                            answerRadioFlag = true
                    }
                    }
                    else{
                        flagError = true
                        messageError = "Ви не ввели текст відповіді"
                    }
                    
                }
                if(questionBlock.querySelector(".answers").id == "input"){
                    let answerText = answerInput.querySelector(".answer-text")
                    if (answerText.value != ""){
                        countAnswers = countAnswers + 2
                        answerRadioFlag = true
                        questionInformation["correct_answer"] = answerText.value
                    }
                    else{
                        flagError = true
                        messageError = "Ви не ввели текст відповіді"
                    }
                    
                }
                if(questionBlock.querySelector(".answers").id == "multiple_choice"){
                    
                    let answerText = answerInput.querySelector(".answer-text")
                    let answerRadio = answerInput.querySelector(".checkbox")
                    
                    if (answerText.value != ""){
                        questionInformation["options"].push(answerText.value)
                        countAnswers = countAnswers + 1

                        if (answerRadio.checked){
                            questionInformation["correct_answer"] += answerText.value + "%$№" 
                            answerRadioFlag = true
                    }
                    }
                    else{
                        flagError = true
                        messageError = "Ви не ввели текст відповіді"
                    }
                    
                }
                if(questionBlock.querySelector(".answers").id == "image"){
                    
                    let answerText = answerInput.querySelector(".answer-text")
                    let answerRadio = answerInput.querySelector(".question-radio")
                    
                    if (answerText.value != ""){
                        questionInformation["options"].push(answerText.value)
                        countAnswers = countAnswers + 1

                        if (answerRadio.checked){
                            questionInformation["correct_answer"] = answerText.value
                            answerRadioFlag = true
                    }
                    }
                    else{
                        flagError = true
                        messageError = "Ви не ввели текст відповіді"
                    }
                    
                }
            })
            if(answerRadioFlag && countAnswers >= 2){
                data["questions"].push(questionInformation)
            }
            else{
                flagError = true
                messageError = "Ви не вибрали правильну відповідь або ввели мало питань"
            }
        }
        else{
            flagError = true
            messageError = "Ви неправильно ввели текст питання чи час"
        }
            
        }
        else{
            flagError = true
            if(messageError == "")(messageError = "Ви не задали назву тесту або опис")
        }})
    
    if(flagError == false){
        correctData = data
        console.log(correctData)
    }
    console.log(flagError)
    // console.log(messageError)
    
    return correctData
}

$("#submit-button").click(function () {
    $.ajax({
        url: "/build_test",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(buildTest()),
        success: function (data) {
            console.log(data)

            window.location.href = "/quizzes/"
        }
    })
})



