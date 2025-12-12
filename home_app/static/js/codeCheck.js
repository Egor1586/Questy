function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

$(() => {
    let testId= ""
    let currentCodes = [];
    let saevedRoom= getCookie("room")
    
    async function updateCodes() {
        try {
            const response = await fetch('/get_active_codes');
            const codes = await response.json();
            currentCodes = codes;
        } catch (error) {
            console.log(error);
        }
    }

    if (saevedRoom){
        $('#modal-bg-connect').fadeIn(200);
    }

    $('#connect-test-btn').on('click', () => {
        if (saevedRoom){
            window.location.href= `/room${saevedRoom}`
        }
    })
        
    updateCodes();
    setInterval(updateCodes, 5000);
        
    $('.search-btn').on('click', () => {
        const room = $('#room').val().trim();
        
        if (currentCodes.includes(room)) {
            window.location.href = `/room${room}`; 
        } 
    })

    $('.test-card').on('click', function() {
        testId= $(this).data('test-id')
        const title= $(this).data('test-title')

        $('#modal-id').text(`Test id ${testId}`);
        $('#modal-desc').text(`Ви впевнені, що хочете почати тест ${title}?`);
        $('#modal-bg').fadeIn(200);
    });

    $('#start-test-btn').on('click', () => {
        if (testId){
            window.location.href= `/passing_test?test_id=${testId}&question_number=0`
        }
    })

    $('.back-btn').on('click', function(){
        $('#modal-bg').fadeOut(200)
        $('#modal-bg-connect').fadeOut(200)
    }) 

    $('#modal-bg').on('click', function(element) {
        if ($(element.target).is('#modal-bg')){
            $(this).fadeOut(200)
        }
    })

    $('#room').on('keydown', function(event){
        if (event.key === "Enter"){
            event.preventDefault()
            $('.search-btn').click()
        }
    })
})