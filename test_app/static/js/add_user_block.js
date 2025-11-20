function createUserBlock(username, author_name, block_username, type) {   
    
    let userListDiv
    if (type === "not"){
        userListDiv= document.getElementById("user-list")
        const emptyUserBlock= document.getElementById("emty-users-list")
    
        if (emptyUserBlock){
            emptyUserBlock.remove();
        }
        
        let checkingUserBlock= document.getElementById(`${block_username}`)
        
        if (checkingUserBlock) {
            return
        }
    } else {
        userListDiv= document.getElementById("waite-users")
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
    

    if (username === author_name) {
        const btnRemove= document.createElement("button");
        btnRemove.className= "btn-remove";
        btnRemove.type= "button";
        btnRemove.textContent= "Видалити"
        btnRemove.onclick = function () {
            kickUser(block_username);
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