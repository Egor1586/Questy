function appendResultRow(resultContainer, username, answersArrey) {
    const resultRow = document.createElement('div');
    resultRow.className = 'result-row';

    const studentName = document.createElement('div');
    studentName.className = 'student-name';
    studentName.textContent = `${username}`;

    const studentScore = document.createElement('div');
    studentScore.className = 'student-score';
    studentScore.textContent = 'Student score';

    const studentAccuracy = document.createElement('div');
    studentAccuracy.className = 'student-accuracy';
    studentAccuracy.textContent = 'student accuracy'

    const answersList = document.createElement('div');
    answersList.className = 'answer-list';

    answersArrey.forEach(correct => {
        const answerBox = document.createElement('div');
        answerBox.className = 'answer-box';
        answerBox.classList.add(correct ? 'correct' : 'incorrect');
        answerBox.textContent = correct ? '✓' : 'x';
        answersList.appendChild(answerBox);
    });

    resultRow.appendChild(studentName);
    resultRow.appendChild(studentScore);
    resultRow.appendChild(studentAccuracy);
    resultRow.append(answersList)


    resultContainer.appendChild(resultRow);
}


function renderResultTest(username, author_name, total_question) {
    const resultContainer = document.getElementById("room-content");
    resultContainer.innerHTML= "";
    resultContainer.id = 'results-container';
    resultContainer.className= 'results-container';

    const header = document.createElement('div');
    header.className = 'result-header';

    const headerName = document.createElement('div');
    headerName.className = 'header-name';
    headerName.textContent = 'header name';

    const headerScore = document.createElement('div');
    headerScore.className = 'header-score';
    headerScore.textContent = 'Header score'

    const headerAccuracy = document.createElement('div');
    headerAccuracy.className = 'header-accuracy';
    headerAccuracy.textContent = 'header accuracy'

    const headerAnswers = document.createElement('div');
    headerAnswers.className = 'header-answers';

    let accuracy_aquestions= []
    for (number=0; number < total_question; number++){
        accuracy_aquestions.push({
            question: `Q${number + 1}`,
            accuracy: `100%`
        });
    }

    questaccuracy_aquestionsions.forEach(questionFor => {
        const div = document.createElement('div');
        div.innerHTML = `${questionFor.question}<br><small>${questionFor.accuracy}</small>`;
        headerAnswers.appendChild(div);
    })

    header.appendChild(headerName);
    header.appendChild(headerScore);
    header.appendChild(headerAccuracy);
    header.appendChild(headerAnswers);
 
    resultContainer.appendChild(header);

    setTimeout(function() {
        socket.emit("room_get_result", {
            room: room,
            username: username,
            author_name: author_name
        });
    }, 10); 

    socket.on('room_get_result_data', function(data) {          
        console.log(data);
        
        for (const username in data) {
            const answersArray = data[username];
            appendResultRow(resultContainer, username, answersArray);
        }
    });

}