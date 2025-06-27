function leaveTest(){
    
    const cookies = document.cookie.split(';'); // сплитим куки
    
    for (let index = 0;  index < cookies.length; index++){
        const cookie = cookies[index].trim();  // тут мы очищаем от пробелов
        const key = cookie.indexOf('='); // Ищем первый элемент
        const name = key > -1 ? cookie.substring(0, key): cookie;
        
        if (document.cookie.indexOf(name + '=') > -1 && !/expires=/.test(cookie)){ // тут как я понял проверка на session
            document.cookie = name + "=; max_age= 0; path=/;";
        }
    }
    
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
        headerName.textContent = 'header name';

        const headerScore = document.createElement('div');
        headerScore.className = 'header-score';
        headerScore.textContent = 'Header score'

        const headerAccuracy = document.createElement('div');
        headerAccuracy.className = 'header-accuracy';
        headerAccuracy.textContent = 'header accuracy'

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


    const leaveButton = document.createElement('button');
    leaveButton.className = 'leave-btn';
    leaveButton.textContent = 'Leave button';
    leaveButton.addEventListener("click", leaveTest);

    resultContainer.appendChild(leaveButton);
}