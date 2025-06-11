const startButton = document.querySelectorAll('.start-btn');

for (let i = 0; i < startButton.length; i++) {
    const button = startButton[i];
    button.addEventListener(
        'click', 
        function (event) {
        const quiz = button.closest('.quiz-item');
        const span = quiz.querySelector('.room');
        const room = span.textContent.trim()

        if (room) {
            window.location.href = `/room${room}`;
        }
    });
}