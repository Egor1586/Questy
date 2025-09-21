const arreyButton = document.querySelectorAll(".answer")

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
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
