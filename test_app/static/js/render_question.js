function renderQuestion() {
    const content = document.getElementById("content");
    content.innerHTML = ""; 

    content.textContent = "Qustion 1";

    const chat = document.createElement('p');
    chat.id = 'messages';
    chat.className = 'messages';

    content.appendChild(chat);
}

