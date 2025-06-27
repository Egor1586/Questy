function createUserBlock(username, author_name, block_username) {    
    const userListDiv = document.getElementById("user-list")
    
    let checkingUserBlock= document.getElementById(`${block_username}`)
    
    if (checkingUserBlock) {
        return
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
        
        userActions.appendChild(btnRemove);
        userBlock.appendChild(userActions);
    }
    
    userListDiv.appendChild(userBlock);

    return userListDiv;
 
}

