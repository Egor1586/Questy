console.log("jQuery версия:", $.fn.jquery);

function newTask(){
    $.ajax ({
        url: "/class_page/task",
        method: "GET",
        dataType: "json",
        success: function (data) {
            data1=data["class_online_task"]
            console.log("STOP")     
            console.log(data1)       

            for (let element= 0; element < data1.length; element++){
                const classCard = $(`#${data1[element][0]}`)

                console.log(data1[element][0])
                console.log(data1[element][1])
                console.log(classCard)

                
            }
        },
        error: function(thx) {
            console.log(thx)
        }
    })
}

newTask()
setInterval(newTask, 5000)
