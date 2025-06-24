
function renderResultTest() {
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

    const questions = [
        { question: 'Q1', accuracy: '100%' },
        { question: 'Q2', accuracy: '100%' },
        { question: 'Q3', accuracy: '100%' },
        { question: 'Q4', accuracy: '40%' },
        { question: 'Q5', accuracy: '80%' },
        { question: 'Q6', accuracy: '80%' },
        { question: 'Q7', accuracy: '80%' },
        { question: 'Q8', accuracy: '80%' }
    ];

    questions.forEach(questionFor => {
        const div = document.createElement('div');
        div.innerHTML = `${questionFor.question}<br><small>${questionFor.accuracy}</small>`;
        headerAnswers.appendChild(div);
    })

    header.appendChild(headerName);
    header.appendChild(headerScore);
    header.appendChild(headerName);
    header.appendChild(headerAccuracy);
    header.appendChild(headerAnswers);
 
    resultContainer.appendChild(header);

    const resultRow = document.createElement('div');
    resultRow.className = 'result-row';

    const studentName = document.createElement('div');
    studentName.className = 'student-name';
    studentName.textContent = 'Student name';

    const studentScore = document.createElement('div');
    studentScore.className = 'student-score';
    studentScore.textContent = 'Student score';

    const studentAccuracy = document.createElement('div');
    studentAccuracy.className = 'student-accuracy';
    studentAccuracy.textContent = 'student accuracy'

    const answersList = document.createElement('div');
    answersList.className = 'answer-list';

    const answersArrey = [true, true, true, true, true, false, true, true];

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