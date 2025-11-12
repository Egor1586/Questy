function renderScores(data){
    let scoreResult= $(".score-result")
    scoreResult.empty()

    const scores= data.scores
    const tests= data.tests

    
    scores.forEach(score => {
        let testId = score.test_id !== undefined ? score.test_id : score[2];
        let test = tests.find(t => t.id === testId);

        if (test){
            let testCard= `
            <div class="test-card">   
                <p><strong>Тест: </strong>${ test.title }</p>
                <p><strong>Опис: </strong>${ test.description }</p>
                <p><strong>Автор: </strong>${ test.author_name }</p>
                <p><strong>Код: </strong>${ test.test_code }</p>
                <a href="/review_results${ test.id }">
                    <button>Переглянути</button>
                </a>
    
                <p><strong>Результат: </strong>${ score.accuracy }</p>
                <p><strong>Дата: </strong>${ score.date_complete }</p>
                <p><strong>Час: </strong>${ score.time_complete }</p>
                
            </div>`
    
            scoreResult.append(testCard)
        }
    });
}

$(() => {
    $(".my-class").on('click', (event => {
        $.ajax({
            url: "/profile/sorte",
            type: "PUT",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({sortyType: "date"}),
            success: renderScores,
            error: function (xhr, status, error) {
                console.log(error)
            }  
        })
    }))

    $(".accuracy").on('click', (event => {
        $.ajax({
            url: "/profile/sorte",
            type: "PUT",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({sortyType: "accuracy"}),
            success: renderScores,
            error: function (xhr, status, error) {
                console.log(error)
            }  
        })
    }))
})