function renderRoomMain(testCode, authorName, username, quizzes, userListName) {
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

    let durationSeconds= 0
    quizzes.forEach(quiz => {
        durationSeconds += Number(quiz.time) + 15
    });

    let duration= durationSeconds / 60
    let durationFix= duration.toFixed(2)

    // Інформація про тест
    const testInfo = document.createElement("div");
    testInfo.className = "test-info-box";
    testInfo.innerHTML = `
        <h3>Інформація про тест</h3>
        <ul>
            <li>Кількість запитань: ${quizzes.length}</li>
            <li>Тривалість: ${durationFix} хвилин</li>
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

    const allUsers = document.createElement("div");
    allUsers.id = "all-users";
    allUsers.className = "all-users";

    // Список учасників
    const userList = document.createElement("div");
    userList.id = "user-list";
    userList.className = "user-list";

    if (!userListName){
        userList.innerHTML = `
            <div class="user-block teacher-block">
                <div class="user-name"><strong>Вчитель:</strong> ${authorName}</div>
            </div>
            <div class="user-block empty-block" id="emty-users-list">
                <div class="user-name">Учні ще не приєдналися. Очікуємо...</div>
            </div>
        `;
    }else {
        userList.innerHTML = `
            <div class="user-block teacher-block">
                <div class="user-name"><strong>Вчитель:</strong> ${authorName}</div>
            </div>`
    }
    const info1 = document.createElement("div");
    info1.className = "info-user";

    const userListText = document.createElement("h3");
    userListText.className= "user-list-title"
    userListText.textContent = "Список учасників:";
    
    info1.appendChild(userListText)
    allUsers.appendChild(info1);
    allUsers.appendChild(userList);

    if (authorName === username) {

        const info2 = document.createElement("div");
        info2.className = "info-user";

        const waiteUsers = document.createElement("div");
        waiteUsers.id = "waite-users";
        waiteUsers.className = "waite-users";

        
        const waiteUsersText = document.createElement("h3");
        waiteUsersText.className= "user-list-title"
        waiteUsersText.textContent = "Зал очікування:";
        info2.appendChild(waiteUsersText)

        allUsers.appendChild(info2);
        allUsers.appendChild(waiteUsers);
    }

    waiteSideTop.appendChild(allUsers);

    let waiteSideBottom;
    // Кнопка "Почати" для автора
    waiteSideBottom = document.createElement("div");
    waiteSideBottom.className = "waite-side-bottom";
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
        buttonEnd.addEventListener("click", () => {
            authorLeaveTest("waite")
        });
        waiteSideBottom.appendChild(buttonEnd);
    } else{
        const leaveButton = document.createElement("button");
        leaveButton.type = "button";
        leaveButton.className = "btn-end";
        leaveButton.textContent = "Залишити тест";
        leaveButton.addEventListener("click", leaveTestBlock);
        waiteSideBottom.appendChild(leaveButton);
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
    if (waiteSideBottom) {
        waiteSide.appendChild(waiteSideBottom)
    }

    container.appendChild(waiteSide);
    container.appendChild(chat);
    content.appendChild(container);

    // Кількість учасників
    const participantsBox = document.createElement("div");
    participantsBox.className = "participants-box";

    const participantsTitle = document.createElement("h3");
    participantsTitle.textContent = "Кількість учасників";
    participantsBox.appendChild(participantsTitle);

    if (userListName){
        let userListBlocks= userListName.split("</>")
        userListBlocks.forEach(block => {
            createUserBlock(username, authorName, block.split("()")[0], 0, "not");
        })
    }

    $('#msg').on('keydown', function(event){
        if (event.key === "Enter"){
            event.preventDefault()
            $('.send-btn').click()
        }
    })
}
