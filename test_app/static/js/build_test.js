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
            "question_text": "",
            "options": [],
            "correct_answer": [],
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

            let arrayAnswersInput = questionBlock.querySelector(".answers").querySelectorAll(".answer-input")
            arrayAnswersInput.forEach(answerInput => {
                let answerText = answerInput.querySelector(".answer-text")
                let answerRadio = answerInput.querySelector(".question-radio")
                
                if (answerText.value != ""){
                    questionInformation["options"].push(answerText.value)
                    countAnswers++

                    if (answerRadio.checked){
                        questionInformation["correct_answer"].push(answerText.value)
                        answerRadioFlag = true
                }
                }else{
                    flagError = true
                    messageError = "Ви не ввели текст відповіді"
                }
                    
                
                
            })
            if(answerRadioFlag && countAnswers >= 2){
                data["questions"].push(questionInformation)
            }else{
                    flagError = true
                    messageError = "Ви не вибрали правильну відповідь або ввели мало питань"
                }
        
        }else{
                    flagError = true
                    messageError = "Ви неправильно ввели текст питання чи час"
                }
            
        })
    
    if(data["description"] != "" && data["topic"] != "" && flagError == false){
        correctData = data
        console.log(correctData)
    }else{
        flagError = true
        if(messageError == "")(messageError = "Ви не задали назву тесту або опис")
    }
    console.log(flagError)
    console.log(messageError)
    
    return data
}

$("#submit-button").click(function () {
    $.ajax({
        url: "/build_test",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(buildTest()),
        success: function (data) {
            console.log(data)
        }
    })
})



