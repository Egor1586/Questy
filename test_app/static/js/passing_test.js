const arreyButton = document.querySelectorAll(".answer")
const arreyMultipleChoiceButton= document.querySelectorAll(".multiple-answer")

const InputButton = document.querySelector(".input-answer")
const MultipleChoiceButton = document.querySelector(".multiple-choice-answer")

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// NEW_TYPE

if (InputButton) {
    InputButton.addEventListener("click", function(event) {
        let currentAnswers= getCookie("user_answers");
        let answerValue= document.querySelector(".input-with-answer").value

        console.log(answerValue)

        if (!answerValue){
            answerValue= "not_answer"
        }
        
        if (!currentAnswers){
            document.cookie = `user_answers=${answerValue}; path = /`     
        }
        else{
            user_answer = getCookie("user_answers");
            document.cookie = `user_answers=${user_answer}|${answerValue}; path= /`
        }       
    })
}

if (MultipleChoiceButton){
    MultipleChoiceButton.addEventListener("click", function(event) {
        let answerValue= ""
        let currentAnswers= getCookie("user_answers");

        for (const value of document.querySelectorAll(".active-multiple-answer")){
            if (!answerValue){
                answerValue += value.id
            }
            else{
                answerValue += "$$$" + value.id
            }
        }
        
        console.log(answerValue)

        if (!answerValue){
            answerValue= "not_answer"
        }
        
        if (!currentAnswers){
            document.cookie = `user_answers=${answerValue}; path = /`     
        }
        else{
            user_answer = getCookie("user_answers");
            document.cookie = `user_answers=${user_answer}|${answerValue}; path= /`
        }       
    })
}

for (let count = 0; count < arreyMultipleChoiceButton.length; count++ ) {
    let button= arreyMultipleChoiceButton[count];
    
    button.addEventListener(
        type= "click" ,
        listener= function ( event ) {
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
        listener= function ( event ) {
            let currentAnswers= getCookie("user_answers");
            
            if (!currentAnswers){
                document.cookie = `user_answers=${button.id}; path = /`     
            }
            else{
                user_answer = getCookie("user_answers");
                document.cookie = `user_answers=${user_answer}|${button.id}; path= /`
            }       
        }
    )
}
