function renderAuthorStart(countUser) {
    const roomContent = document.getElementById("room-content");
    roomContent.innerHTML = ""; 

    roomContent.textContent = `Author start test, count users : ${countUser}`;

    const chat = document.createElement('p');
    chat.id = 'messages';
    chat.className = 'messages';

    roomContent.appendChild(chat);
}