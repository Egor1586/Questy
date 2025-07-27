function authorLeaveTest(){
    let currentURL = window.location.href;
    let roomCode = currentURL.split('room')[1]

    console.log(currentURL)
    console.log(`Это код теста: ${roomCode}`)
    
    socket.emit("test_end", {
            room: roomCode
        });
    
    document.cookie = `state=; max-age=0; path=/;`;
    document.cookie = `user_answers=; max-age=0; path=/;`;
    document.cookie = `countUsersAnswer=; max-age=0; path=/;`;

    window.location.href = '/'; 
}

function appendResultRow(resultContainer, username, answersArrey) {
    const resultRow = document.createElement('div');
    resultRow.className = 'result-row';

    const studentName = document.createElement('div');
    studentName.className = 'student-name';
    studentName.textContent = `${username}`;

    let numberCorrectAnswers = 0;
    for (let index= 0; index < answersArrey.length; index++) {
        if (answersArrey[index]){
            numberCorrectAnswers++;
        }
    }

    const studentScore = document.createElement('div');
    studentScore.className = 'student-score';
    studentScore.textContent = `${numberCorrectAnswers}/${answersArrey.length}`;

    let accuracy = (numberCorrectAnswers / total_question) * 100;

    const studentAccuracy = document.createElement('div');
    studentAccuracy.className = 'student-accuracy';
    studentAccuracy.textContent = `${accuracy.toFixed(1)}%`;

    const answersList = document.createElement('div');
    answersList.className = 'answer-list';

    answersArrey.forEach(correct => {
        const answerBox = document.createElement('div');
        answerBox.className = 'answer-box';
        answerBox.classList.add(correct ? 'correct-answer' : 'incorrect-answer');
        answerBox.textContent = correct ? '✓' : 'x';
        answersList.appendChild(answerBox);
    });

    resultRow.appendChild(studentName);
    resultRow.appendChild(studentScore);
    resultRow.appendChild(studentAccuracy);
    resultRow.append(answersList)


    resultContainer.appendChild(resultRow);
}


function renderAuthorResultTest(username, author_name, total_question) {

    const container = document.getElementById("room-content");
    container.innerHTML= "";
    container.className= 'wrapper-author-results-container';

    const resultContainer = document.createElement('div');
    resultContainer.id = 'author-results-container';
    resultContainer.className= 'author-results-container';

    setTimeout(function() {
        socket.emit("room_get_result", {
            room: room,
            username: username,
            author_name: author_name
        });
    }, 100); 

    let accurancyArray= []
    
    socket.once('room_get_result_data', function(data) {  
        const header = document.createElement('div');
        header.className = 'result-header';

        const headerName = document.createElement('div');
        headerName.className = 'header-name';
        headerName.textContent = "Ім'я";

        const headerScore = document.createElement('div');
        headerScore.className = 'header-score';
        headerScore.textContent = 'Оцінка'

        const headerAccuracy = document.createElement('div');
        headerAccuracy.className = 'header-accuracy';
        headerAccuracy.textContent = 'Точність'

        const headerAnswers = document.createElement('div');
        headerAnswers.className = 'header-answers';       
        console.log(data);
        
        
        header.appendChild(headerName);
        header.appendChild(headerScore);
        header.appendChild(headerAccuracy);
        header.appendChild(headerAnswers);
        
        resultContainer.appendChild(header);
        
        let allAnswersArray= Object.values(data)
        const userCount = Object.keys(allAnswersArray).length;
        
        let answersArray= []
        for (const username in data) {
            answersArray = data[username];
            appendResultRow(resultContainer, username, answersArray);
        }

        for (let question_number= 0; question_number < answersArray.length; question_number++){
            console.log("question_number")
            let pas_accurasy= 0;
            for (let array= 0; array < allAnswersArray.length; array++){
                console.log("array")
                if (allAnswersArray[array][question_number]){
                    pas_accurasy++
                }
            }
            const accuracy= (pas_accurasy / userCount) * 100;
            accurancyArray.push(accuracy.toFixed(1));
        }   

        console.log(accurancyArray)
        
        let accuracy_aquestions= []
        for (number=0; number < total_question; number++){
            accuracy_aquestions.push({
                question: `Q${number + 1}`,
                accuracy: `${accurancyArray[number]}`
            });
        }

        accuracy_aquestions.forEach(questionFor => {
            const div = document.createElement('div');
            div.innerHTML = `${questionFor.question}<br><small>${questionFor.accuracy}</small>`;
            headerAnswers.appendChild(div);
        })
    });


    const leaveButton= document.createElement('button');
    leaveButton.className= 'leave-btn';
    leaveButton.textContent = 'Покинути тест';
    leaveButton.addEventListener("click", authorLeaveTest);

    container.appendChild(resultContainer)
    container.appendChild(leaveButton);
}
