function authorLeaveTest(){
    let currentURL = window.location.href;
    let roomCode = currentURL.split('room')[1];
    roomCode= roomCode.split("?")[0]
    
    socket.emit("end_test", {
        room: room,         
        username: username  
    });
     
    socket.emit("test_end", {
        room: roomCode
    });
    
    document.cookie = `state=; max-age=0; path=/;`;
    document.cookie = `userAnswers=; max-age=0; path=/;`;
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

function appendResultRow(resultTable, username, answersArrey) {
    const resultRow = document.createElement('div');
    resultRow.className = 'results-row';

    const studentName = document.createElement('div');
    studentName.className = 'cell student-name';
    studentName.textContent = `${username}`;

    let numberCorrectAnswers = 0;
    for (let index= 0; index < answersArrey.length; index++) {
        if (answersArrey[index] == 1){
            numberCorrectAnswers++;
        }
    }

    let accuracy = (numberCorrectAnswers / totalQuestion) * 100;

    const studentAccuracy = document.createElement('div');
    studentAccuracy.className = 'accuracy';
    studentAccuracy.textContent = `${accuracy.toFixed(1)}%`;

    resultRow.appendChild(studentName);

    answersArrey.forEach(correct => {
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
}

function renderAccuracyChart(canvasId, accuracy_aquestions){

    const ctx= document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: accuracy_aquestions.map(item => item.question),
            datasets: [{
                label: 'Точність відповідей (%)',
                data: accuracy_aquestions.map(item => parseFloat(item.accuracy)),
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
                    max: 100,
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

function exel_table(username, author_name){
    setTimeout(function() {
        socket.emit("room_get_result", {
            room: room,
            username: username,
            author_name: author_name
        });
    }, 100); 
    
    socket.once('room_get_result_data', function(data) {  
        const resultData = data.room_get_result_data;
        const best_score_data = data.best_score_data;

        const firstUser = Object.keys(resultData)[0];
        const totalQuestions = resultData[firstUser].length;

        let headerRow = ["Учень"];
        for (let i = 1; i <= totalQuestions; i++) {
            headerRow.push(`Q${i}`);
        }
        headerRow.push("Точність");

        let table = [];
        table.push(headerRow);

        let totalAccuracy = 0;
        let usersCount = 0;
        for (const user in resultData) {
            const answers = resultData[user];
            const correct = answers.filter(a => a === 1).length;
            const accuracyNumber = correct / answers.length;
            const accuracy = (accuracyNumber * 100).toFixed(1) + "%";

            totalAccuracy += accuracyNumber;
            usersCount++;

            let row = [user];

            answers.forEach(a => {
                if (a === 1) row.push("✅");
                else if (a === 0) row.push("❌");
                else row.push("➖"); 
            });

            row.push(accuracy);
            table.push(row);
        }
        const averageAccuracy = ((totalAccuracy / usersCount) * 100).toFixed(1) + "%";
        console.log(totalAccuracy)
        table.push([]);
        table.push(["Найкращий результат", best_score_data.user_name,`${best_score_data.accuracy}%`]);
        table.push(["Середній результат", averageAccuracy]);
        

        const worksheet = XLSX.utils.aoa_to_sheet(table);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

        XLSX.writeFile(workbook, "results.xlsx");
    });
}
function renderAuthorResultTest(username, author_name, total_question) {

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
            author_name: author_name
        });
    }, 100); 

    let accurancyArray= []
    
    socket.once('room_get_result_data', function(data) {  
        const resultData= data.room_get_result_data
        const best_score_data= data.best_score_data
        const averega_score= data.averega_score

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
        const contentBox = document.createElement('div');
        contentBox.className = 'content-box';

        const chartBox = document.createElement('div');
        chartBox.className = 'chart-box';

        const headerTitle2 = document.createElement('h2');
        headerTitle2.textContent = "Загальна успішність";

        const chartWrapper = document.createElement('div');
        chartWrapper.className = 'chart-wrapper';

        const chartCanvas = document.createElement('canvas');
        chartCanvas.id = 'authorAccuracyChart';
        chartCanvas.className = 'authorAccuracyChart';
        chartCanvas.width = 1100;
        chartCanvas.height = 500;

        chartBox.appendChild(headerTitle2);
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

        //
        let allAnswersArray= Object.values(resultData)
        const userCount = Object.keys(allAnswersArray).length;

        let answersArray= []
        let accuracy_aquestions= []

        for (let question_number= 0; question_number < total_question; question_number++){
            let pas_accurasy= 0;
            for (let array= 0; array < allAnswersArray.length; array++){
                if (allAnswersArray[array][question_number] == 1){
                    pas_accurasy++
                }
            }
            
            const accuracy= (pas_accurasy / userCount) * 100;
            accurancyArray.push(accuracy.toFixed(1));
        } 

        for (number=0; number < total_question; number++){
            accuracy_aquestions.push({
                question: `Q${number + 1}`,
                accuracy: `${accurancyArray[number]}`
            });
        }

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
            `8vw repeat(${total_question}, ${32 /total_question}vw) 5.9vw`
        )

        const resultHeader = document.createElement('div');
        resultHeader.className = 'results-header';

        const headerUsers = document.createElement('div');
        headerUsers.className = 'label';  
        headerUsers.textContent= "Учні"

        resultHeader.appendChild(headerUsers);
        
        accuracy_aquestions.forEach(questionFor => {
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
            answersArray = resultData[username]; 
            appendResultRow(resultTable, username, answersArray);
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
     
        const leaveButton= document.createElement('button');
        leaveButton.className= 'leave-btn';
        leaveButton.textContent = 'Покинути тест';
        leaveButton.addEventListener("click", authorLeaveTest);

        const exelButton= document.createElement('button');
        exelButton.className= 'exel_table';
        exelButton.textContent = 'exel_table';
        exelButton.addEventListener("click", () => exel_table(username, author_name));
        
        infoBox.appendChild(baseInfo)
        infoBox.appendChild(resultTable);
        infoBox.appendChild(leaveButton)
        infoBox.appendChild(exelButton)
        contentBox.appendChild(infoBox)
        container.appendChild(contentBox)

        renderAccuracyChart('authorAccuracyChart', accuracy_aquestions);
    });
}
