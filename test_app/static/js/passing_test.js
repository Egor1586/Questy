const arreyButton = document.querySelectorAll(".answer")
const arreyMultipleChoiceButton= document.querySelectorAll(".multiple-answer")

const inputButton = document.querySelector(".input-answer")
const multipleChoiceButton = document.querySelector(".multiple-choice-answer")

if (inputButton){
    inputButton.addEventListener("click", function(event) {   
        let userAnswer= getCookie("userAnswers")
        let answerValue= document.querySelector(".input-with-answer").value

        if (!answerValue){
            answerValue= "not_answer"
        }
            
        if (!userAnswer){
            setCookie("userAnswers", answerValue) 
        } 
        else{
            setCookie("userAnswers", `${userAnswer}|${answerValue}`) 
        }  
    })
}

if (multipleChoiceButton){
    multipleChoiceButton.addEventListener("click", function(event) {
        let answerValue= ""
        let currentAnswers= getCookie("userAnswers");

        for (const value of document.querySelectorAll(".active-multiple-answer")){
            if (!answerValue){
                answerValue += value.id
            }
            else{
                answerValue += "$$$" + value.id
            }
        }
        
        if (!answerValue){
            answerValue= "not_answer"
        }

        if (!currentAnswers){
            setCookie("userAnswers", answerValue) 
        } else{
            userAnswer = getCookie("userAnswers");
            console.log(userAnswer, answerValue)
            document.cookie = `userAnswers=${userAnswer}|${answerValue}; path= /`
            setCookie("userAnswers", `${userAnswer}|${answerValue}`)     
        }
    })
}

for (let count = 0; count < arreyMultipleChoiceButton.length; count++ ) {
    let button= arreyMultipleChoiceButton[count];

    const checkmark = document.createElement("span")
    checkmark.classList.add("checkmark")
    checkmark.textContent = "✓"
    
    button.addEventListener(
        type= "click" ,
        listener= function (event) {
            if (button.className === "multiple-answer"){
                button.className= "active-multiple-answer"
                button.appendChild(checkmark)

            }
            else{
                button.className= "multiple-answer"
                button.removeChild(checkmark)
            }
        }
    )
}


for (let count = 0; count < arreyButton.length; count++ ) {
    let button= arreyButton[count];
    button.addEventListener(
        type= "click" ,
        listener= function (event) {
            let currentAnswers= getCookie("userAnswers");
            
            if (!currentAnswers){
                setCookie("userAnswers", button.id) 
            }
            else{
                userAnswer = getCookie("userAnswers");
                setCookie("userAnswers", `${userAnswer}|${button.id}`) 
            }      
        }
    )
}
