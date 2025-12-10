const arreyButton = document.querySelectorAll(".answer")
const arreyMultipleChoiceButton= document.querySelectorAll(".multiple-answer")

const inputButton = document.querySelector(".input-answer")
const multipleChoiceButton = document.querySelector(".multiple-choice-answer")
let addToken= 0

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

if (inputButton) {
    inputButton.addEventListener("click", function(event) {   
        let user_answer= getCookie("userAnswers")
        let answerValue= document.querySelector(".input-with-answer").value
        if (!answerValue){
            answerValue= "not_answer"
        }
            
        if (!user_answer){
            document.cookie = `userAnswers=${answerValue}; path = /`    
        } 
        else{
            document.cookie = `userAnswers=${user_answer}|${answerValue}; path= /`
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
            document.cookie = `userAnswers=${answerValue}; path = /`     
        }
        else{
            user_answer = getCookie("userAnswers");
            document.cookie = `userAnswers=${user_answer}|${answerValue}; path= /`
        }      
    })
}

for (let count = 0; count < arreyMultipleChoiceButton.length; count++ ) {
    let button= arreyMultipleChoiceButton[count];
    
    button.addEventListener(
        type= "click" ,
        listener= function (event) {
            if (button.className == "multiple-answer"){
                button.className= "active-multiple-answer"
            }
            else{
                button.className= "multiple-answer"
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
                document.cookie = `userAnswers=${button.id}; path = /`  
            }
            else{
                user_answer = getCookie("userAnswers");
                document.cookie = `userAnswers=${user_answer}|${button.id}; path= /`
            }      
        }
    )
}
