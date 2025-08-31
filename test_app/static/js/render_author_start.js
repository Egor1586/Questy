let donatChart;

function renderDoughnutChart(canvasId, totalAnswer, correctCount){
    let correctPercent= (correctCount/totalAnswer) * 100;
    let incorrectPercent= 100- correctPercent;

    try {
        let existing_chart = Chart.getChart('donat-chart')
        existing_chart.destroy();

        let lastChart = Chart.getChart('authorAccuracyChart')
        if (lastChart){
            lastChart.destroy()
        }
    } catch(error) {
    }

    const ctx= document.getElementById(canvasId).getContext('2d');
    donatChart= new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Правильні (%)', 'Неправильні (%)'],
            datasets: [{
                data: [correctPercent, incorrectPercent],
                borderColor: ['rgba(69, 184, 46, 0.6)', 'rgba(186, 47, 60, 0.6)'],
                backgroundColor: ['rgba(69, 184, 46, 1)', 'rgba(186, 47, 60, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
            cutout:'50%'
            }
        }
    });
}

function addUserAnswer(username, answer, authorname, totalAnswer) {
    console.log("add user answer")
    
    const userAnswers = document.getElementById("user-answers");
    const countAnswerSpan  = document.getElementById("count-answer-span");

    countAnswerSpan.textContent= `${parseInt(countAnswerSpan.textContent) + 1}`;

    let correctAnswerDiv  = document.getElementById("author-correct-answer");
    let correctAnswer= correctAnswerDiv.textContent.split(":")[1].trim()

    console.log(typeof correctAnswer, correctAnswer, typeof answer, answer)
    if (answer == correctAnswer){
        countCorrect= parseInt(getCookie("countCorrectAnswer"))+ 1
        document.cookie = `countCorrectAnswer= ${countCorrect}; path=/`;
    }
    userAnswers.innerHTML += `
        <div class="user-answer">
            <div class="user-name">${username}</div>
            <div class="answer-text">${answer}</div>
        </div>
    `
    socket.emit("get_usernames", {
        room: room,
        authorname: authorname
    });

    socket.on('get_usernames', function(data){
        let userArrey = data;
        lengthArrey = userArrey.length

        countUsersAnswer= getCookie("countUsersAnswer")
        correctAnswerChart= getCookie("countCorrectAnswer")
        
        if (lengthArrey == countUsersAnswer){
            console.log("create chart")
            renderDoughnutChart("donat-chart", lengthArrey, correctAnswerChart)
        }
    })
}

function stopTest(){
    console.log("stop test")

    socket.emit("stop_test", {
        room: room,
        author_name: author_name
    });

    document.cookie = `state= author_result_test; path=/`;
    console.log(`Stop test ${getCookie("state")}`);

    renderAuthorResultTest(username, author_name, total_question);
}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function renderAuthorStart(quiz, answers, room, authorname, state, total_question) {
    const waiteContent = document.getElementById("room-content");
    waiteContent.innerHTML = ""; 
    waiteContent.id = 'container-question'
    waiteContent.className = 'container-question'

    // Нижній контейнер
    const headerBar = document.createElement('div')
    headerBar.className = 'header-bar'

    const question = document.createElement('div')
    question.id = 'author-question'
    question.className = 'author-question'
    question.textContent= `Питання: ${quiz.question_text}`

    const correct_answer = document.createElement('div')
    correct_answer.id = 'author-correct-answer'
    correct_answer.className = 'author-correct-answer'
    correct_answer.textContent= `Правильна відповідь: ${quiz.correct_answer}`

    const nextButton = document.createElement('button')
    nextButton.id = 'next-q'
    nextButton.className = 'next-q'
    nextButton.textContent = 'Наступне питання'
    nextButton.addEventListener("click", nextQuestion);

    headerBar.appendChild(question)
    headerBar.appendChild(correct_answer)
    headerBar.appendChild(nextButton)
    
    waiteContent.appendChild(headerBar)

    const userBlock = document.createElement('div')
    userBlock.id = 'user-block'
    userBlock.className = 'user-block'

    const userAnswers = document.createElement('div')
    userAnswers.id = 'user-answers'
    userAnswers.className = 'user-answers'

    
    userBlock.appendChild(userAnswers)
    
    const userInfo = document.createElement('div')
    userInfo.id = 'user-info'
    userInfo.className = 'user-info'

    const studInfoBox = document.createElement('div')
    studInfoBox.id = 'stud-info-box'
    studInfoBox.className = 'stud-info-box'

    const chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'donat-chart'
    chartCanvas.className = 'donat-chart'
    
    userInfo.appendChild(studInfoBox)
    userInfo.appendChild(chartCanvas)

    userBlock.appendChild(userInfo)

    waiteContent.appendChild(userBlock)

    socket.emit("get_usernames", {
        room: room,
        authorname: authorname
    });

    socket.once('get_usernames', function(data){
        let userArrey = data;
        lengthArrey = userArrey.length
        studInfoBox.innerHTML = `
            <h3>Інформація для вчителя</h3>
            <ul>
                <li>Відповіли: <strong><span id="count-answer-span">0</span></strong></li>
                <li>Список користувачів: <strong>${lengthArrey}</strong></li>
                <li>Всього учнів: <strong></strong>${lengthArrey}</li>
            </ul>
            `
    })
}
