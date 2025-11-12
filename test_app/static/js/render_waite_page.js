function renderRoomMain(testCode, authorName, username) {
    const content = document.getElementById("room-content");
    content.innerHTML = "";

    const container = document.createElement("div");
    container.className = "room-container";
    
    const waiteSideTop = document.createElement("div");
    waiteSideTop.className = "waite-side-top";

    const waiteSide = document.createElement("div");
    waiteSide.className = "waite-side";

    // Заголовок
    const roomTitle = document.createElement("h2");
    roomTitle.className = "waite-title";
    roomTitle.textContent = "Кімната очікування";
    waiteSideTop.appendChild(roomTitle);

    // Інформація про автора та код
    const infoBar = document.createElement("div");
    infoBar.className = "info-bar";

    const textAuthor = document.createElement("div");
    textAuthor.className = "info-text";
    textAuthor.textContent = `Автор: ${authorName}`;

    const textCode = document.createElement("div");
    textCode.className = "info-text";
    textCode.innerHTML = `Код тесту: <strong>${testCode}</strong>`;

    infoBar.appendChild(textAuthor);
    infoBar.appendChild(textCode);
    waiteSideTop.appendChild(infoBar);

    // Інформація про тест
    const testInfo = document.createElement("div");
    testInfo.className = "test-info-box";
    testInfo.innerHTML = `
        <h3>Інформація про тест</h3>
        <ul>
            <li>Кількість запитань: 10</li>
            <li>Тривалість: 20 хв</li>
            <li>Всього учнів: 4</li>
        </ul>
    `;
    waiteSideTop.appendChild(testInfo);

    // Інструкції
    const instructions = document.createElement("div");
    instructions.className = "instructions-box";
    instructions.innerHTML = `
        <h3>Кількість учасників</h3>
        <ol>
            <li>Не оновлюйте сторінку під час тесту</li>
            <li>Не використовуйте сторонні ресурси</li>
            <li>Тест можна пройти лише один раз</li>
        </ol>
    `;

    // Список учасників
    const userList = document.createElement("div");
    userList.id = "user-list";
    userList.className = "user-list";

    userList.innerHTML = `
    <div class="user-block teacher-block">
        <div class="user-name"><strong>Вчитель:</strong> ${authorName}</div>
    </div>
    <div class="user-block empty-block" id="emty-users-list">
        <div class="user-name">Учні ще не приєдналися. Очікуємо...</div>
    </div>
    `;
    
    waiteSideTop.appendChild(userList);

    const waiteSideBottom = document.createElement("div");
    waiteSideBottom.className = "waite-side-bottom";

    // Кнопка "Почати" для автора
    if (authorName === username) {
        const buttonStart = document.createElement("button");
        buttonStart.type = "button";
        buttonStart.className = "btn-start";
        buttonStart.textContent = "Почати тест";
        buttonStart.addEventListener("click", authorStartTest);
        waiteSideBottom.appendChild(buttonStart);

        const buttonEnd = document.createElement("button");
        buttonEnd.type = "button";
        buttonEnd.className = "btn-end";
        buttonEnd.textContent = "Завершити тест";
        buttonEnd.addEventListener("click", endTest);
        waiteSideBottom.appendChild(buttonEnd);
    }

    // Чат
    const chat = document.createElement("div");
    chat.className = "chat";
    chat.innerHTML = `
        <h2>Чат для спілкування</h2>
        <div id="messages" class="messages">
            <div class="no-messages" id="no-messages">Поки що немає повідомлень...</div>
        </div>

        <input id="msg" class="msg-chat" type="text" placeholder="Введіть повідомлення">
        <button type="button" class="send-btn">Надіслати</button>
    `;

    chat.querySelector(".send-btn").addEventListener("click", sendMessage);

    waiteSide.appendChild(waiteSideTop)
    waiteSide.appendChild(waiteSideBottom)

    container.appendChild(waiteSide);
    container.appendChild(chat);
    content.appendChild(container);

    // Кількість учасників
    const participantsBox = document.createElement("div");
    participantsBox.className = "participants-box";

    const participantsTitle = document.createElement("h3");
    participantsTitle.textContent = "Кількість учасників";
    participantsBox.appendChild(participantsTitle);

    //participantsBox.appendChild(participantsList);
    //waiteSide.appendChild(participantsBox);
}
