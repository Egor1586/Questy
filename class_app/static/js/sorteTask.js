console.log("jQuery версия:", $.fn.jquery);

$(document).ready(function () {
    $('#course').on('change', function (){
        const selectedValue = $(this).val()
        
        $.ajax({
            url: "/task_page/sorte",
            type: "PUT",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({sortytype: selectedValue}),
            success: function (data) {
                console.log(data.task_list);

                $("#tasks").empty()

                if (data.sorty_type === "all"){
                    tasks= [data.cur_week_task_list, data.next_week_task_list, data.duetime_task_list , data.overdue_task_list]
                    
                    for (let [index, task_list] of tasks.entries()){
                        
                        let allTasks = $('<div>')
                            .addClass("category")
                            .attr("data-course", "all")

                        let categoryType = ["На цей тиждень", "Наступний тиждень", "Без терміну", "Термін здачі пропущено"]

                        allTasks.append($(`<h3>${categoryType[index]}</h3>`))
                        
                        if (task_list.length !== 0){
                            for (let task of task_list) {
                                let taskHTML = `
                                <details>
                                    <summary>Завдання <span class="arrow"></span></summary>
                                    <div class="task-details">
                                        Назва: ${ task.title }. <br>
                                        Опис: ${ task.description }. <br>
                                        Дедлайн: ${ task.due_time }.
                                    </div>
                                </details>`
                                
                                allTasks.append(taskHTML)
                            }
                        }
                        else {
                            let notTaskHTML = `<details>                
                                                    <summary> Немає завдань <span class="arrow"></span></summary>            
                                            </details>`
                            
                            allTasks.append(notTaskHTML)
                        }

                        $("#tasks").append(allTasks)
                    }
                }   
                else {
                    let allTasks = $('<div>')
                        .addClass("category")
                        .attr("data-course", data.class["id"])

                    for (let task of data.task_list) {
                        let taskHTML = `<details>
                            <summary>Завдання <span class="arrow"></span></summary>
                            <div class="task-details">
                                Назва: ${ task.title }. <br>
                                Опис: ${ task.description }. <br>
                                Дедлайн: ${ task.due_time }.
                            </div>
                        </details>`
                        
                        allTasks.append(taskHTML)
                    }
                    $("#tasks").append(allTasks)
                }
            },
            error: function (xhr, status, error) {
                console.log(error)
            }  
        })
    })
})