// ==========================================================================================
function renderResultTest() {
    const content= document.getElementById("room-content");
    content.innerHTML= "";

    const resultContainer = document.createElement('div');
    resultContainer.className = 'result-container';

    const headerContainer = document.createElement('div');
    headerContainer.className = 'result-header';

    const headerName = document.createElement('div');
    headerName.className = 'header-name';

    const headerScore = document.createElement('div');
    headerScore.className = 'header-score';

    const headerAccuracy = document.createElement('div');
    headerAccuracy.className = 'header-accuracy';

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

    headerContainer.appendChild(headerName);
    headerContainer.appendChild(headerScore);
    headerContainer.appendChild(headerName);
    headerContainer.appendChild(headerAccuracy);
    headerContainer.appendChild(headerAnswers);
 
    resultContainer.appendChild(headerContainer);
    content.appendChild(resultContainer);

    
    const resultRow = document.createElement('div');
    resultRow.className = 'result-row';

    const studentName = document.createElement('div');
    studentName.className = 'student-name';

    const studentScore = document.createElement('div');
    studentScore.className = 'student-score';

    const studentAccuracy = document.createElement('div');
    studentAccuracy.className = 'student-accuracy';

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
}
// ==========================================================================================