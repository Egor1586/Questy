function renderRoomMain(testCode, authorName, username) {
    const content= document.getElementById("room-content");
    content.innerHTML= "";

    const waiteSide= document.createElement("div");
    waiteSide.className= "waite-side";
    
    const infoBar= document.createElement("div");
    infoBar.className= "info-bar";

    const textAuthor= document.createElement("div");
    textAuthor.className= "info-text";
    textAuthor.textContent= `Автор: ${authorName}`;
    infoBar.appendChild(textAuthor)
    
    const textCode= document.createElement("div");
    textCode.className= "info-text";
    textCode.textContent= `Код тесту: `;
    
    const strongCode= document.createElement("strong");
    strongCode.textContent= `${testCode}`;
    
    textCode.appendChild(strongCode)  
    infoBar.appendChild(textCode)
    waiteSide.appendChild(infoBar)


    const userList= document.createElement("div");
    userList.id = "user-list";
    userList.className= "user-list";
    

    const authorBlock= document.createElement("div");
    authorBlock.className= "user-block";

    const nameAuthor= document.createElement("div");
    nameAuthor.className= "user-name";
    nameAuthor.textContent= `Автор: ${authorName}`;

    authorBlock.appendChild(nameAuthor)
    userList.appendChild(authorBlock)
    waiteSide.appendChild(userList)
    
    
    if (authorName === username){
        const buttonStart = document.createElement("button");
        buttonStart.type= "button";
        buttonStart.className = "btn-start";
        buttonStart.textContent= "Почати";
        buttonStart.addEventListener("click", authorStartTest);

        waiteSide.appendChild(buttonStart)
    }
    
    
    const chat= document.createElement("div");
    chat.className= "chat";
    
    const title = document.createElement("h2");
    title.textContent= "Чат";

    const msg = document.createElement("input");
    msg.id= "msg";
    msg.type= "text";
    msg.placeholder= "Введіть своє повідомлення";
    msg.class= "msg-chat";


    const buttonSend = document.createElement("button");
    buttonSend.class= "send-btn";
    buttonSend.type= "button";
    buttonSend.textContent= "Надіслати повідомлення";
    buttonSend.addEventListener("click", sendMessage);

    const messages = document.createElement("div");
    messages.id= "messages";


    chat.appendChild(title);
    chat.appendChild(msg);
    chat.appendChild(buttonSend);
    chat.appendChild(messages);

    content.appendChild(waiteSide)
    content.appendChild(chat)
}