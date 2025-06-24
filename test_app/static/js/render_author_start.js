function renderAuthorStart() {
    const roomContent = document.getElementById("room-content");
    roomContent.innerHTML = ""; 

    roomContent.textContent = `Author start test`;

    const chat = document.createElement('p');
    chat.id = 'messages';
    chat.className = 'messages';

    let blockResults = document.createElement('div')
    blockResults.className = 'result-block-for-question'

    roomContent.appendChild(chat);
    roomContent.appendChild(blockResults)
}