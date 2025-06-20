function renderAuthorStart() {
    const content = document.getElementById("content");
    content.innerHTML = ""; 

    content.textContent = "Author start test";

    const chat = document.createElement('p');
    chat.id = 'messages';
    chat.className = 'messages';

    content.appendChild(chat);
}