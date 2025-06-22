function renderAuthorStart() {
    const roomContent = document.getElementById("room-content");
    roomContent.innerHTML = ""; 

    roomContent.textContent = `Author start test`;

    const chat = document.createElement('p');
    chat.id = 'messages';
    chat.className = 'messages';

    roomContent.appendChild(chat);
}