let charts= {}
let selectUserName= null
let selectBlock= true

function authorLeaveTest(type){
    let currentURL = window.location.href;
    let roomCode = currentURL.split('room')[1];
    roomCode= roomCode.split("?")[0]
   
    if (type === "waite"){
        socket.emit("end_test", {
            room: room,         
            username: username  
        });
    }
     
    socket.emit("test_end", {
        room: roomCode
    });
    
    document.cookie = `state=; max-age=0; path=/;`;
    document.cookie = `countUsersAnswer=; max-age=0; path=/;`;
    document.cookie = `countCorrectAnswer=; max-age=0; path=/;`;
    document.cookie = `timeStop=; max-age=0; path=/;`;
    document.cookie = `time=; max-age=0; path=/;`;
    document.cookie = `blockedUsers=; max-age=0; path=/;`;
    document.cookie = `userList=; max-age=0; path=/;`;

    setTimeout(() => {
        window.location.href = '/'; 
    }, 200);
}

function appendResultRow(resultTable, username, answersArray, resultData, accuracyAquestionsArray, accurancyArray, totalQuestion) {
    const resultRow = document.createElement('div');
    resultRow.className = 'results-row';
    resultRow.id= `row_${username}`

    const studentName = document.createElement('div');
    studentName.className = 'cell student-name';
    studentName.textContent = `${username}`;

    let numberCorrectAnswers = 0;
    for (let index= 0; index < answersArray.length; index++) {
        if (answersArray[index] == 1){
            numberCorrectAnswers++;
        }
    }

    let accuracy = (numberCorrectAnswers / totalQuestion) * 100;

    const studentAccuracy = document.createElement('div');
    studentAccuracy.className = 'accuracy';
    studentAccuracy.textContent = `${accuracy.toFixed(1)}%`;

    resultRow.appendChild(studentName);

    answersArray.forEach(correct => {
        const answerBox = document.createElement('div');
        answerBox.className = 'cell';

        const spanBox = document.createElement('span');
        spanBox.className = 'cell';

        switch (correct){
            case 0:
                spanBox.className= 'circle wrong';
                break;
            case 1:
                spanBox.className= 'circle correct';
                break;
            case 2:
                spanBox.className= 'circle no-answer';
                break; 
        }

        answerBox.appendChild(spanBox)
        resultRow.appendChild(answerBox);
    });

    resultRow.appendChild(studentAccuracy);
    resultTable.appendChild(resultRow);

    resultRow.addEventListener('click', function(){
        chartManager(resultData, accuracyAquestionsArray, accurancyArray, totalQuestion, this.id.slice(4))
    })
}

function chartManager(resultData, accuracyAquestionsArray, accurancyArray, totalQuestion, userName= null){
    const selectElement = document.getElementById("choice");

    if (userName){
        choiceSelector= document.getElementById('choice')
        chartBoxLable= document.querySelector('.chart-box-label')
        console.log(chartBoxLable)
        chartBoxLable.textContent= `Успішність ${userName}`

        selectBlock= false
        choiceSelector.innerHTML= `
            <option value="1">${userName} успішність</option>
            <option value="3">${userName} відсоток правильності проходження</option>
            <option value="4">${userName} витрачений час на питання</option>
        `

        selectUserName= userName
        createChart1('authorAccuracyChart', resultData, accuracyAquestionsArray, accurancyArray, userName)
    }

    switch (Number(selectElement.value)){
        case 1:
            createChart1('authorAccuracyChart', resultData, accuracyAquestionsArray, accurancyArray, selectUserName)
            break;
        case 2:
            createChart2('authorAccuracyChart', resultData, totalQuestion, selectUserName)
            break;
        case 3:
            createChart3('authorAccuracyChart', resultData, totalQuestion, selectUserName)
            break; 
        case 4:
            createChart4('authorAccuracyChart', resultData, totalQuestion, selectUserName)
            break; 
    }

    selectBlock= true
}


function accuracyAquestions(resultData, totalQuestion){
    let accurancyArray= []
    let accuracyAquestionsArray= []
    let allAnswersArray= Object.values(resultData)
    const userCount = Object.keys(allAnswersArray).length;

    for (let question_number= 0; question_number < totalQuestion; question_number++){
        let pas_accurasy= 0;
        for (let array= 0; array < allAnswersArray.length; array++){
            if (allAnswersArray[array].correct_answers_list[question_number] == 1){
                pas_accurasy++
            }
        }
        
        const accuracy= (pas_accurasy / userCount) * 100;
        accurancyArray.push(accuracy.toFixed(1));
    } 

    for (number=0; number < totalQuestion; number++){
        accuracyAquestionsArray.push({
            question: `Q${number + 1}`,
            accuracy: `${accurancyArray[number]}`
        });
    }

    return {accuracyAquestionsArray, accurancyArray}
}

function createChart1(canvasId, resultData, accuracyAquestionsArray, accurancyArray, userName= null){
    let accurancyNumbers= []
    let labels= []

    if (userName && resultData[userName]){
        accurancyNumbers= resultData[userName].correct_answers_list.map(result =>{
            switch (result){
                case 0:
                    return 0
                case 1:
                    return 100
                case 2:
                    return 0 
            }
        })
    } else{
        accurancyNumbers= accurancyArray.map(Number)
        labels= accuracyAquestionsArray.map(item => item.question)
    }

    const ctx= document.getElementById(canvasId).getContext('2d');

    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }
  
    charts[canvasId]= new Chart(ctx, {
        type: 'line',
        data: {
            labels: accuracyAquestionsArray.map(item => item.question),
            datasets: [{
                label: 'Точність відповідей (%)',
                data: accurancyNumbers,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointRadius: 5
            }]
        },
        options: {
            scales: {
                y:{
                    beginAtZero: true,
                    suggestedMax: 100,
                    title: {
                        display: true,
                        text:'Точність (%)'
                    }
                },
                x: {
                    title:{
                        display: true,
                        text: 'Номер питання'
                    }
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function createChart2(canvasId, resultData, totalQuestion, userName= null){
    const ctx= document.getElementById(canvasId).getContext('2d');
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }

    const labels= []
    const correctCounts= new Array(totalQuestion).fill(0)
    let wrongCounts= new Array(totalQuestion).fill(0)

    let users= Object.keys(resultData)
    if(userName){
        users= users.includes(userName) ? [userName] : []
    }

    if (!users.length){
        return
    }

    users.forEach(user =>{
        let answers= resultData[user].correct_answers_list
        for (let number=0; number < totalQuestion; number++){
            let answer= answers[number]
            if (answer === 1){
                correctCounts[number]++
            } else{
                wrongCounts[number]++
            }
        }
    })

    let newWrongCounts= wrongCounts.map(count => -count)

    for (let label= 0; label < totalQuestion; label++){
        labels.push(`Q${label+ 1}`)
    }

    charts[canvasId]= new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Правильно",
                    data: correctCounts,
                    backgroundColor: 'green',
                    borderColor: 'green',
                    borderWidth: 1
                },
                {
                    label: 'Неправильно / пропущено',
                    data: newWrongCounts,
                    backgroundColor: 'red',
                    borderColor: 'red',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Номер питання'
                    }
                },
                y: {
                    beginAtZero: false,
                    min: -Math.ceil(Math.max(...wrongCounts) * 1.2),
                    max: Math.ceil(Math.max(...correctCounts) * 1.2),
                    title: {
                        display: true, 
                        text: 'Кількість користувачів'
                    },
                    ticks: {
                        callbacks: value => Math.abs(value)
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: ctx => ctx.datasets.label+ ': '+ Math.abs(ctx.parsed.y) 
                    }
                }
            }
        }
    })
}

function createChart3(canvasId, resultData, totalQuestion, userName= null){
    const colors = [
        '#1f77b4','#ff7f0e','#2ca02c','#9467bd','#8c564b',
        '#e377c2','#7f7f7f','#bcbd22','#17becf','#393b79',
        '#637939','#8c6d31','#843c39','#7b4173','#5254a3',
        '#6b6ecf','#9c9ede','#ce6dbd','#de9ed6','#31a354'
    ];

    const ctx= document.getElementById(canvasId).getContext('2d');
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }

    const dataValues= []
    const dataColors= []
    
    let correctTotal= 0
    let users= Object.keys(resultData)
    let totalSlices= users.length* totalQuestion
    if(userName){
        users= users.includes(userName) ? [userName] : []
        totalSlices= totalQuestion
    }

    users.forEach((user, index) => {
        const answers= resultData[user].correct_answers_list
        const correctCount= answers.filter(answer => answer === 1).length
        correctTotal += correctCount

        dataValues.push(correctCount)
        dataColors.push(colors[index])
    })

    let remaining= totalSlices- correctTotal
    if (remaining > 0){
        dataValues.push(remaining)
        dataColors.push('rgba(255,0,0,0.6)')
    }

    const labels= [...users]
    if (remaining > 0){
        labels.push("Неправильні / пропущені")
    }

    charts[canvasId]= new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: dataValues,
                backgroundColor: dataColors,
                borderColor: 'green',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context){
                            const label= context.label
                            const value= context.parsed
                            const percent= ((value/ totalSlices) * 100).toFixed(1)
                            return `${label}: ${value} (${percent}%)`
                        }
                    }
                }
            }
        }
    })
}

function createChart4(canvasId, resultData, totalQuestion, userName= null){
    const ctx= document.getElementById(canvasId).getContext('2d');
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }

    let labels= []
    const totalTimers= new Array(totalQuestion).fill(0)

    let users= Object.keys(resultData)
    if(userName){
        users= users.includes(userName) ? [userName] : []
    }

    if (!users.length){
        return
    }

    users.forEach(user => {
        const timers= resultData[user].timers_list
        for (let number= 0; number < totalQuestion; number++){
            const time= parseFloat(timers[number])
            totalTimers[number] += time
        }
    })

    for (let label= 0; label < totalQuestion; label++){
        labels.push(`Q${label+ 1}`)
    }

    charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Суммарное время (сек) на вопрос',
                data: totalTimers,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Номер вопроса'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Суммарное время (сек)'
                    }
                }
            },
            plugins: {
                legend: { display: true }
            }
        }
    });
}

function renderAuthorResultTest(username, authorName, totalQuestion) {
    let container = document.getElementById("container-question");
    
    if (container === null){
        container = document.getElementById("room-content");
    }

    container.innerHTML= "";
    container.className= 'wrapper-author-results-container';

    setTimeout(function() {
        socket.emit("room_get_result", {
            room: room,
            username: username,
            author_name: authorName
        });
    }, 100); 
    
    socket.once('room_get_result_data', function(data) {  
        const resultData= data.room_get_result_data
        const best_score_data= data.best_score_data
        const averega_score= data.averega_score
        const {accuracyAquestionsArray, accurancyArray}= accuracyAquestions(resultData, totalQuestion)

        const header = document.createElement('div');
        header.className = 'results-header-block';

        const headerTitle = document.createElement('h1');
        headerTitle.textContent = "Результати тесту";

        const headerText = document.createElement('p');
        headerText.textContent = "Зведена статистика успішності всіх учасників";

        header.appendChild(headerTitle);
        header.appendChild(headerText);
        container.appendChild(header);

        //
        const buttonBox = document.createElement('div');
        buttonBox.className = 'button-box';
  
        const leftButtonBox = document.createElement('div');
        leftButtonBox.className = 'left-button-box';
        
        const rigthButtonBox = document.createElement('div');
        rigthButtonBox.className = 'right-button-box';

        const leaveButton= document.createElement('button');
        leaveButton.className= 'leave-btn';
        leaveButton.textContent = 'Покинути тест';
        leaveButton.addEventListener("click", () => {
            authorLeaveTest("test")
        });

        const allInfoButton= document.createElement('button');
        allInfoButton.className= 'all-info-btn';
        allInfoButton.textContent = 'Загальна успішність'
        allInfoButton.addEventListener("click", () => {
            chartBoxLable= document.querySelector('.chart-box-label')
            console.log(chartBoxLable)
            chartBoxLable.textContent= 'Загальна успішність'
            
            selectUserName= null
            choiceSelector= document.getElementById('choice')

            selectBlock= false
            choiceSelector.innerHTML= `
                <option value="1">Загальна успішність</option>
                <option value="2">Кількість правильних/неправильних відповідей</option>
                <option value="3">Відсоткове співвідношення правильних відповідей</option>
                <option value="4">Витрачено часу на запитання</option>
            `
            selectBlock= true
            createChart1('authorAccuracyChart', resultData, accuracyAquestionsArray, accurancyArray, totalQuestion);
        });

        const exelButton= document.createElement('button');
        exelButton.className= 'exel-btn';
        exelButton.textContent = 'Exel table';

        leftButtonBox.appendChild(allInfoButton)
        rigthButtonBox.appendChild(exelButton)
        rigthButtonBox.appendChild(leaveButton)
        buttonBox.appendChild(leftButtonBox)
        buttonBox.appendChild(rigthButtonBox)
        container.appendChild(buttonBox);

        const contentBox = document.createElement('div');
        contentBox.className = 'content-box';

        const chartBox = document.createElement('div');
        chartBox.className = 'chart-box';

        const headerTitle2 = document.createElement('h2');
        headerTitle2.className= "chart-box-label"
        headerTitle2.textContent = "Загальна успішність";

        const chartWrapper = document.createElement('div');
        chartWrapper.className = 'chart-wrapper';

        const chartCanvas = document.createElement('canvas');
        chartCanvas.id = 'authorAccuracyChart';
        chartCanvas.className = 'authorAccuracyChart';
        chartCanvas.width = 1100;
        chartCanvas.height = 500;

        chartBox.appendChild(headerTitle2);

        chartBox.innerHTML += `
            <select name="choice" id="choice">
                <option value="1">Загальна успішність</option>
                <option value="2">Кількість правильних/неправильних відповідей</option>
                <option value="3">Відсоткове співвідношення правильних відповідей</option>
                <option value="4">Витрачено часу на запитання</option>
            </select>
        `

        chartWrapper.appendChild(chartCanvas);
        chartBox.appendChild(chartWrapper);
        contentBox.appendChild(chartBox);

        //
        const infoBox = document.createElement('div');
        infoBox.className = 'info-box';

        const baseInfo = document.createElement('div');
        baseInfo.className = 'base-info';

        const resultsInfoBox = document.createElement('div');
        resultsInfoBox.className = 'results-info-box';

        const headerTitle3 = document.createElement('h3');
        headerTitle3.textContent = "Підсумок";  

        // посчитать средний результат 
        const resultsInfoBoxText = document.createElement('p')
        resultsInfoBoxText.id= "results-info-box-text"
        resultsInfoBoxText.innerHTML= `<p><strong>Середний результат: </strong>${averega_score}</p>`;

        // найти лучший результат
        const resultsInfoBoxText2 = document.createElement('p');
        resultsInfoBoxText2.id= "results-info-box-text2"
        resultsInfoBoxText2.innerHTML = `<p><strong>Найкращий результат:</strong>${best_score_data.user_name} (${best_score_data.accuracy})</p>`;

        resultsInfoBox.appendChild(headerTitle3);
        resultsInfoBox.appendChild(resultsInfoBoxText2);
        resultsInfoBox.appendChild(resultsInfoBoxText);
        baseInfo.appendChild(resultsInfoBox);

        const resultTable = document.createElement('div');
        resultTable.className = 'results-table';

        resultTable.style.setProperty(
            'grid-template-columns',
            `8vw repeat(${totalQuestion}, ${32 /totalQuestion}vw) 5.9vw`
        )

        const resultHeader = document.createElement('div');
        resultHeader.className = 'results-header';

        const headerUsers = document.createElement('div');
        headerUsers.className = 'label';  
        headerUsers.textContent= "Учні"

        resultHeader.appendChild(headerUsers);
        accuracyAquestionsArray.forEach(questionFor => {
            const div = document.createElement('div');
            div.className= "cell";
            div.innerHTML = `${questionFor.question}`;
            resultHeader.appendChild(div);
        })

        const headerAccyracy = document.createElement('div');
        headerAccyracy.className = 'label';  
        headerAccyracy.textContent= "Точність"
        
        resultHeader.appendChild(headerAccyracy);
        resultTable.appendChild(resultHeader);
        
        for (const username in resultData) {
            answersArray = resultData[username].correct_answers_list; 
            appendResultRow(resultTable, username, answersArray, resultData, accuracyAquestionsArray, accurancyArray, totalQuestion);
        }  
        
        const legenBox = document.createElement('div');
        legenBox.className = 'legend-box';
    
        const legenBoxTitle = document.createElement('h3');
        legenBoxTitle.textContent = "Позначення";
    
        const legend = document.createElement('div');
        legend.className= "legend";
        legend.innerHTML += `
                        <span><span class="circle correct"></span> Правильно</span>
                        <span><span class="circle wrong"></span> Неправильно</span>
                        <span><span class="circle no-answer"></span> Немає відповіді</span>
                        `
        legenBox.appendChild(legenBoxTitle);
        legenBox.appendChild(legend);
        baseInfo.appendChild(legenBox);
        
        infoBox.appendChild(baseInfo)
        infoBox.appendChild(resultTable);
        contentBox.appendChild(infoBox)
        container.appendChild(contentBox)
        

        document.getElementById('choice').addEventListener('change', function() {
            if (selectBlock){
                chartManager(resultData, accuracyAquestionsArray, accurancyArray, totalQuestion)
            }
        })

        createChart1('authorAccuracyChart', resultData, accuracyAquestionsArray, accurancyArray, totalQuestion);
    });
}

