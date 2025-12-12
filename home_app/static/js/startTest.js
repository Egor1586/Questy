$(() => {
    $('.start-btn').on('click', function() {
        const quiz = $(this).closest('.quiz-item');
        const span = quiz.find('.room').text().trim();

        if (room) {
            window.location.href = `/room${room}`;
        }
    })

    $('#clear').on('click', () => {
        document.cookie= `state=; max-age=0; path=/;`;
        document.cookie= `countUsersAnswer=; max-age=0; path=/;`;
        document.cookie= `countCorrectAnswer=; max-age=0; path=/;`;
        document.cookie= `timeStop=; max-age=0; path=/;`;
        document.cookie= `time=; max-age=0; path=/;`;
        document.cookie= `blockedUsers=; max-age=0; path=/;`;
        document.cookie= `userList=; max-age=0; path=/;`;
        document.cookie= `room=; max-age=0; path=/`;
    })
})
