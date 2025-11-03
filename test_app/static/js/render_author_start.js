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

function addUserAnswer(username, answer, authorname, quiz) {
    const userAnswers = document.getElementById("user-answers");
    const countAnswerSpan  = document.getElementById("count-answer-span");

    countAnswerSpan.textContent= `${parseInt(countAnswerSpan.textContent) + 1}`;

    let correctAnswerDiv  = document.getElementById("author-correct-answer");
    console.log(correctAnswerDiv.textContent)

    let correctAnswer= ''
    if (correctAnswerDiv.textContent.includes(':')){
        correctAnswer= correctAnswerDiv.textContent.split(":")[1].trim()
    }
    else{
        correctAnswer= correctAnswerDiv.textContent.trim()
    }

    console.log(typeof correctAnswer, correctAnswer, typeof answer, answer)

    if (answer == correctAnswer){
        countCorrect= parseInt(getCookie("countCorrectAnswer"))+ 1
        document.cookie = `countCorrectAnswer=${countCorrect}; path=/`;
    }

    if (quiz.question_type){
        answer= answer.replace("$$$", " та ")
    }

    userAnswers.innerHTML += `
        <div class="user-answer">
            <div class="user-name">${username}</div>
            <div class="answer-text">
                <p>${answer}</p>
                <p>Час витрачений на відповідь: ${parseInt(quiz.time)- parseInt(getCookie('time')) + plusAnswerTime} сек.</p>
            </div>
        </div>
    `

    socket.emit("get_usernames", {
        room: room,
        authorname: authorname
    });

    socket.once('get_usernames', function(data){
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

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function plusTime(){
    socket.emit("plus_time", {
        room: room,
        author_name: author_name
    });
}

function stopTime(){
    socket.emit("change_time", {
        room: room,
        author_name: author_name
    });
}

function renderAuthorStart(quiz, answers, room, authorname, state, total_question) {
    const waiteContent = document.getElementById("room-content");
    waiteContent.innerHTML = ""; 
    waiteContent.id = 'container-question'
    waiteContent.className = 'container-question'

    const headerBar = document.createElement('div')
    headerBar.className = 'header-bar'

    const questionTable= document.createElement('table')
    questionTable.className= 'question-table'

    const headerRow= document.createElement('tr')
    const questionHeader= document.createElement('th')
    questionHeader.textContent= "Питання:"
    const answerHeader= document.createElement('th')
    answerHeader.textContent= "Правильна відповідь:"

    headerRow.appendChild(questionHeader)
    headerRow.appendChild(answerHeader)

    const infoRow= document.createElement('tr')
    const questionInfo= document.createElement('td')
    questionInfo.id= 'author-question'
    questionInfo.className= 'author-question'
    questionInfo.textContent= quiz.question_text

    const correctAnswer= document.createElement('td')

    const answerSpan= document.createElement('span')
    answerSpan.style.display= "none"
    answerSpan.id= 'author-correct-answer'
    answerSpan.className= 'author-correct-answer'
    
    if (quiz.question_type == "multiple_choice"){
        answerSpan.textContent= `${quiz.correct_answer.replace("%$№", " ")}`
    }
    else{
        answerSpan.textContent= `${quiz.correct_answer}`
    }

    const eyeIcon= document.createElement('span')
    eyeIcon.textContent= "👁";
    eyeIcon.className= 'eye-icon'
    eyeIcon.cursor= 'pointer'
    eyeIcon.title= "Показати / Приховати правильну відповідь";

    eyeIcon.addEventListener('click', () => {
        if (answerSpan.style.display === "none"){
            answerSpan.style.display= 'inline'
            eyeIcon.textContent= "👁"
        }
        else{
            answerSpan.style.display= 'none'
            eyeIcon.textContent=  "👁"
        }
    })

    correctAnswer.appendChild(answerSpan)
    correctAnswer.appendChild(eyeIcon)

    infoRow.appendChild(questionInfo)
    infoRow.appendChild(correctAnswer)

    questionTable.appendChild(headerRow)
    questionTable.appendChild(infoRow)
    headerBar.appendChild(questionTable)
    
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

    const chartDiv = document.createElement('div')
    chartDiv.id = 'chart-div'
    chartDiv.className = 'chart-div'

    const chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'donat-chart'
    chartCanvas.className = 'donat-chart'
    
    // userInfo.appendChild(studButttons)
    userInfo.appendChild(studInfoBox)

    chartDiv.appendChild(chartCanvas)
    userInfo.appendChild(chartDiv)

    userBlock.appendChild(userInfo)

    waiteContent.appendChild(userBlock)

    socket.emit("get_usernames", {
        room: room,
        authorname: authorname
    });

    let quizTime= getCookie("time");

    socket.once('get_usernames', function(data){
        let userArrey = data;
        lengthArrey = userArrey.length
        studInfoBox.innerHTML = `
            <div> 
                <h3>Інформація для вчителя</h3>
                <ul>
                    <li>Всього учнів: <strong></strong>${lengthArrey}</li>
                    <li>Відповіли: <strong><span id="count-answer-span">0</span></strong></li>
                </ul>
            </div>
            <div class="test-nav-btn"> 
                <button id="next-q" class="next-q" onclick="nextQuestion()">Наступне питання</button>
                <div class="test-time-btn"> 
                    <button onclick="plusTime()" class="timer-btn">Plus +15</button>
                    <button onclick="stopTime()" id="play-btn" class="timer-btn">Stop</button>
                    <p id="timer">${quizTime}</p>
                </div>
            </div>
            `
        const timerText= document.getElementById("timer")

        if (timerText){
            const coundown= setInterval(() =>{
                if (!timerPaused){
                    time= parseInt(timerText.textContent) - 1;
                    timerText.textContent= time;
                    document.cookie = `time= ${time}; path=/;`;
                
                    if (time <= 0){
                        clearInterval(coundown);
                        timerText.textContent = "Час закінчений"
                    }        
                }
            }, 1000);
        }
    });
}
