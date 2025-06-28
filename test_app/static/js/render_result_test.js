function leaveTest(){
    document.cookie = `state=; max-age=0; path=/;`;
    document.cookie = `user_answers=; max-age=0; path=/;`;
    document.cookie = `countUsersAnswer=; max-age=0; path=/;`;

    window.location.href = '/'; 
}

function renderResultTest(){

    const resultContainer = document.getElementById("room-content");
    resultContainer.innerHTML= "";
    resultContainer.id = 'results-container';
    resultContainer.className= 'results-container';
    
    console.log("apdhihbji")

    const leaveButton= document.createElement('button');
    leaveButton.className= 'leave-btn';
    leaveButton.textContent = 'Leave button';
    leaveButton.addEventListener("click", leaveTest);

    const main= document.getElementById("main")
    main.appendChild(leaveButton);
}