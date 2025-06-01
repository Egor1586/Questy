const arreyButton = document.querySelectorAll(".answer")
console.log("start")
for (let count = 0; count < arreyButton.length; count++ ) {
    let button= arreyButton[count];
    button.addEventListener(
        type= "click" ,
        listener= function ( event ) {
            if (document.cookie == ''){
                document.cookie = `user_answers = ${button.id}; path = /`
            }
            else{
                user_answer = document.cookie.split('=')[1]
                document.cookie = `user_answers = ${user_answer} ${button.id}; path= /`
            }   
            
        }
    )
}