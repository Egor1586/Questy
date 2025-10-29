function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function userLeaveTest() {
    document.cookie = `state=; max-age=0; path=/;`;
    document.cookie = `user_answers=; max-age=0; path=/;`;
    document.cookie = `countUsersAnswer=; max-age=0; path=/;`;
    document.cookie = `temporary_name=; max-age=0; path=/;`;

    window.location.href = '/';
}

function renderResultTest(username, total_question, list_quiz, list_answers, test_id) {
    let answersStr = getCookie("user_answers");
    let answers_list = answersStr.split("|");
    let user_answers = [];
    let answersArrey = [];

    for (let answer of answers_list) {
        if (answer != "|") {
            user_answers.push(answer);
        }
    }

    for (let answer of user_answers) {
        if (answer != "") {
            answersArrey.push(answer);
        }
    }

    let correctAnswer = 0;

    for (let count = 0; count < list_quiz.length; count++) {
        let arrayCorrectAnswers= []
        let arrayUserAnswers= []
        if (list_quiz[count].question_type == "multiple_choice"){
            arrayCorrectAnswers= list_quiz[count].correct_answer.split("%$№")
            arrayUserAnswers= answersArrey[count].split("$$$")
            let correctAnswerAccept= true
            if (arrayCorrectAnswers.length === arrayUserAnswers.length){
                for (let answerIndex = 0; answerIndex < arrayCorrectAnswers.length; answerIndex++){
                    if (arrayCorrectAnswers[answerIndex] !== arrayUserAnswers[answerIndex]){
                        correctAnswerAccept= false;
                        break
                    }
                }
            }
            else{
                correctAnswerAccept= false;
            }

            if (correctAnswerAccept){
                correctAnswer++;
            }
        }
        else {
            if (list_quiz[count].correct_answer === answersArrey[count]) {     
                correctAnswer++;
            }
        }
    }

    let accuracy = (correctAnswer / total_question) * 100;

    const resultContainer = document.getElementById("room-content");
    resultContainer.innerHTML = "";
    resultContainer.id = 'results-container';
    resultContainer.className = 'results-container';

    const resultInfo = document.createElement('div');
    resultInfo.className = 'result-info';

    const testInfo = document.createElement('div');
    testInfo.className = 'text-info';

    const info1 = document.createElement('p');
    info1.innerHTML = `<strong>${username}</strong> ваш результат: <strong>${correctAnswer}</strong> з ${total_question}`;

    const info2 = document.createElement('p');
    info2.innerHTML = `Точність правильних відповідей: <strong>${accuracy.toFixed(1)}%</strong>`;

    const leaveLink = document.createElement('a');
    leaveLink.className = 'home-link';

    const leaveButton = document.createElement('button');
    leaveButton.className = 'home-btn';
    leaveButton.textContent = 'Покинути тест';
    leaveButton.addEventListener("click", userLeaveTest);

    testInfo.appendChild(info1);
    testInfo.appendChild(info2);
    leaveLink.appendChild(leaveButton);
    testInfo.appendChild(leaveButton);

    resultInfo.appendChild(testInfo);

    const answerInfo = document.createElement('div');
    answerInfo.className = 'answer-info';
    answerInfo.innerHTML = `
        <ul>
        <li><span class="color-dot color-green"></span>Правильна відповідь (зелений)</li>
        <li><span class="color-dot color-yellow"></span>Ваша неправильна відповідь (жовтий)</li>
        <li><span class="color-dot color-red"></span>Неправильна відповідь (червоний)</li>
        </ul>
    `;

    resultInfo.appendChild(answerInfo);
    resultContainer.appendChild(resultInfo);

    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'chart-wrapper';

    const chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'myChart';
    chartCanvas.width = 400;
    chartCanvas.height = 200;

    chartWrapper.appendChild(chartCanvas);
    resultContainer.appendChild(chartWrapper);

    const ctx = chartCanvas.getContext('2d');
    new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Правильні відповіді', 'Усього питань'],
        datasets: [{
        label: 'Результат',
        data: [correctAnswer, total_question - correctAnswer],
        backgroundColor: [
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 99, 132, 0.5)'
        ],
        borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
        }]
    },
    options: {
        scales: {
        y: { beginAtZero: true }
        }
    }
    });

    for (let quiz_number = 0; quiz_number < total_question; quiz_number++) {
        let quiz= list_quiz[quiz_number]
        const questionBlock = document.createElement('div');
        questionBlock.className = 'question-block';

        const questionHeader = document.createElement('div');
        questionHeader.className = 'question-header';

        const question = document.createElement('div');
        question.textContent = `${quiz.question_text}`;
        questionHeader.appendChild(question);

        questionBlock.appendChild(questionHeader);

        if (quiz.question_type == "image"){
            const imageDiv = document.createElement("div");
            imageDiv.className = "image-result-div";

            const image = document.createElement("img");
            image.src = `/test_app/static/images/${test_id}/${quiz.image_name}`;
            image.alt= "quiz image";

            imageDiv.appendChild(image)
            questionBlock.appendChild(imageDiv)
        }

        const questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionBlock.appendChild(questionText);

        if (quiz.question_type == "choice" || quiz.question_type == "image"){
            let answers= answersArrey[quiz_number]

            if (answers == "not_answer"){
                const notAnswerDiv = document.createElement('div');
                notAnswerDiv.className = 'answer no-answe';
                notAnswerDiv.textContent = `Відповідь відсутня`;
                questionBlock.appendChild(notAnswerDiv);
            }

            for (let answer_number = 0; answer_number < list_answers[quiz_number].length; answer_number++) {
                let answerText = list_answers[quiz_number][answer_number];
                answers= answersArrey[quiz_number]

                if (answerText !== quiz.correct_answer && answerText !== answers) {
                    const answerIncorrect = document.createElement('div');
                    answerIncorrect.className = 'answer incorrect';
                    answerIncorrect.textContent = `✗ ${answerText}`;
                    questionBlock.appendChild(answerIncorrect);
                } 
                else if (answers !== quiz.correct_answer && answerText === answers) {
                    const answerUserAnswers = document.createElement('div');
                    answerUserAnswers.className = 'answer user_answers';
                    answerUserAnswers.textContent = `✗ ${answerText}`;
                    questionBlock.appendChild(answerUserAnswers);
                } 
                else {
                    const answerCorrect = document.createElement('div');
                    answerCorrect.className = 'answer correct';
                    answerCorrect.textContent = `✓ ${answerText}`;
                    questionBlock.appendChild(answerCorrect);
                }
            }
        }
        else if (quiz.question_type == "input"){
            // console.log("input question")
            let answerText = list_answers[quiz_number];
            let answers= answersArrey[quiz_number]

            if (answers == "not_answer"){
                const notAnswerDiv = document.createElement('div');
                notAnswerDiv.className = 'answer no-answe';
                notAnswerDiv.textContent = `Відповідь відсутня`;
                questionBlock.appendChild(notAnswerDiv);
            }

            // console.log(answerText, answers, quiz.correct_answer)
            if (quiz.correct_answer !== answers){
                // console.log("not correct")
                
                const answerIncorrect = document.createElement('div');
                answerIncorrect.className = 'answer incorrect';
                answerIncorrect.textContent = `✗ ${answers}`;
                questionBlock.appendChild(answerIncorrect);

                const questionTextDiv = document.createElement('div');
                questionTextDiv.className = 'question-text';
                questionTextDiv.textContent = `Правильний варіант.`;
                questionBlock.appendChild(questionTextDiv);

                const answerCorrect = document.createElement('div');
                answerCorrect.className = 'answer correct';
                answerCorrect.textContent = `✓ ${quiz.correct_answer}`;
                questionBlock.appendChild(answerCorrect);
            }
            else{
                // console.log("correct")
                const answerCorrect = document.createElement('div');
                answerCorrect.className = 'answer correct';
                answerCorrect.textContent = `✓ ${quiz.correct_answer}`;
                questionBlock.appendChild(answerCorrect);
            }
        }
        else if (quiz.question_type == "multiple_choice"){
            console.log("multiple_choice question")
            let answerText = list_answers[quiz_number];
            let answers= answersArrey[quiz_number].split("$$$");
            let correct_answer_list= quiz.correct_answer.split("%$№");

            if (answers == "not_answer"){
                const notAnswerDiv = document.createElement('div');
                notAnswerDiv.className = 'answer no-answe';
                notAnswerDiv.textContent = `Відповідь відсутня`;
                questionBlock.appendChild(notAnswerDiv);
                for (let answer_number = 0; answer_number < answerText.length; answer_number++){
                    let answer= answerText[answer_number];

                    if (correct_answer_list.includes(answer)){
                        const answerCorrect = document.createElement('div');
                        answerCorrect.className = 'answer correct';
                        answerCorrect.textContent = `✓ ${answer}`;
                        questionBlock.appendChild(answerCorrect);
                    }
                    else {
                        const answerIncorrect = document.createElement('div');
                        answerIncorrect.className = 'answer incorrect';
                        answerIncorrect.textContent = `✗ ${answer}`;
                        questionBlock.appendChild(answerIncorrect);
                    }
                }
            }
            else{
                for (let answer_number = 0; answer_number < answerText.length; answer_number++){
                    let answer= answerText[answer_number];
                    
                    console.log("multiple_choice question")
                    console.log(answer)
                    console.log(correct_answer_list)
                    console.log("multiple_choice question")
    
                    if (correct_answer_list.includes(answer)){
                        const answerCorrect = document.createElement('div');
                        answerCorrect.className = 'answer correct';
                        answerCorrect.textContent = `✓ ${answer}`;
                        questionBlock.appendChild(answerCorrect);
                    }
                    else if (answers.includes(answer)){
                        const answerIncorrect = document.createElement('div');
                        answerIncorrect.className = 'answer user_answers';
                        answerIncorrect.textContent = `✗ ${answer}`;
                        questionBlock.appendChild(answerIncorrect);
                    }
                    else {
                        const answerIncorrect = document.createElement('div');
                        answerIncorrect.className = 'answer incorrect';
                        answerIncorrect.textContent = `✗ ${answer}`;
                        questionBlock.appendChild(answerIncorrect);
                    }
                }
            }
        }

        resultContainer.appendChild(questionBlock);
    }
}


