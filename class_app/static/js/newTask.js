console.log("jQuery версия:", $.fn.jquery);

function newTask(){
    $.ajax ({
        url: "/class_page/task",
        method: "GET",
        dataType: "json",
        success: function (data) {
            console.log(JSON.stringify(data["new_taks_count"]))
        },
        error: function(thx) {
            console.log(thx)
        }
    })
}

newTask()
setInterval(newTask, 5000)