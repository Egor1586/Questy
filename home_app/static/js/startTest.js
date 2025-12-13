$(() => {
    $('.start-btn').on('click', function() {
        const quiz = $(this).closest('.quiz-item');
        const span = quiz.find('.room').text().trim();

        if (room) {
            window.location.href = `/room${room}`;
        }
    })

    $('#clear').on('click', () => {
        clearCookie(["room", "state", "userList", "countCorrectAnswer", "countUsersAnswer", "blockedUsers", "timeStop", "time"])
    })
})
