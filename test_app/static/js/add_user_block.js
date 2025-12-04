function createUserBlock(username, author_name, block_username, ip,type) {   
    
    let userListDiv
    let checkingUserBlock
    if (type === "not"){
        userListDiv= document.getElementById("user-list")
        const emptyUserBlock= document.getElementById("emty-users-list")
    
        if (emptyUserBlock){
            emptyUserBlock.remove();
        }
        
        checkingUserBlock= document.getElementById(`${block_username}`)
        
        if (checkingUserBlock) {
            return
        }
    } else {
        userListDiv= document.getElementById("waite-users") 
        checkingUserBlock= document.getElementById(`${block_username}`)
        
        if (checkingUserBlock) {
            return
        }
    }
    
    const userBlock= document.createElement("div");
    userBlock.className= "user-block";
    userBlock.id= `${block_username}`

    const userName= document.createElement("div");
    userName.className= "user-name";
    userName.textContent = `${block_username}`;
    userBlock.appendChild(userName);

    const userActions= document.createElement("div");
    userActions.className= "user-actions";
    
    const userIP= document.createElement("p")
    userIP.textContent= `ip:`

    const spanIP= document.createElement("span")
    spanIP.className= "user-ip"
    spanIP.textContent= ip
    console.log(ip)

    userIP.appendChild(spanIP)
    userBlock.appendChild(userIP)

    let kickType
    if (username === author_name) {
        const btnRemove= document.createElement("button");
        btnRemove.className= "btn-remove";
        btnRemove.type= "button";
        if (type === "waite"){
            btnRemove.textContent= "Block"
            kickType= "block"
        } else{
            btnRemove.textContent= "Видалити"
            kickType= "kick"
        }
        btnRemove.onclick = function () {
            kickUser(block_username, ip, kickType);
        };

        if (type === "waite"){
            const btnAccept= document.createElement("button");
            btnAccept.className= "btn-accept";
            btnAccept.type= "button";
            btnAccept.textContent= "Accept"
            btnAccept.onclick = function () {
                addUesrBlock(block_username, this);
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