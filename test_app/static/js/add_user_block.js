function createUserBlock(username, authorName, blockUsername, ip, type) {   
    
    let userListDiv
    let checkingUserBlock
    if (type === "not"){
        userListDiv= document.getElementById("user-list")
        const emptyUserBlock= document.getElementById("emty-users-list")
    
        if (emptyUserBlock){
            emptyUserBlock.remove();
        }
        
        checkingUserBlock= document.getElementById(`${blockUsername}`)
        
        if (checkingUserBlock) {
            return
        }
    } else {
        userListDiv= document.getElementById("waite-users") 
        checkingUserBlock= document.getElementById(`${blockUsername}`)
        
        if (checkingUserBlock) {
            return
        }
    }
    
    const userBlock= document.createElement("div");
    userBlock.className= "user-block";
    userBlock.id= `user${blockUsername}`

    const userName= document.createElement("div");
    userName.className= "user-name";
    userName.textContent = `${blockUsername}`;
    userBlock.appendChild(userName);

    const userActions= document.createElement("div");
    userActions.className= "user-actions";
    
    if (ip){
        const userIP= document.createElement("p")
        userIP.textContent= `ip: `

        const spanIP= document.createElement("span")
        spanIP.className= "user-ip"
        spanIP.textContent= ip

        userIP.appendChild(spanIP)
        userBlock.appendChild(userIP)
    }

    let kickType
    if (username === authorName) {
        const btnRemove= document.createElement("button");
        btnRemove.className= "btn-remove";
        btnRemove.type= "button";
        if (type === "waite"){
            btnRemove.textContent= "Заблокувати"
            kickType= "block"

            const btnKick= document.createElement("button");
            btnKick.className= "btn-remove";
            btnKick.type= "button";
            btnKick.textContent= "Видалити"
            
            btnKick.onclick = function () {
                kickUser(blockUsername, ip, "kick");
            };

            userActions.appendChild(btnKick);
        } else{
            btnRemove.textContent= "Видалити"
            kickType= "kick"
        }
        btnRemove.onclick = function () {
            kickUser(blockUsername, ip, kickType);
        };

        if (type === "waite"){
            const btnAccept= document.createElement("button");
            btnAccept.className= "btn-accept";
            btnAccept.type= "button";
            btnAccept.textContent= "Прийняти"
            btnAccept.onclick = function () {
                addUesrBlock(blockUsername, this);
            };
            
            userActions.appendChild(btnAccept);
        }
        
        userActions.appendChild(btnRemove);
        userBlock.appendChild(userActions);
    }

    if (userListDiv){
        userListDiv.appendChild(userBlock);
        return userListDiv;
    }

    return
}