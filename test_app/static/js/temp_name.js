const tempButton = document.querySelector(".submit-btn");
const tempInput = document.querySelector(".input-name");

const room = window.room;

tempButton.addEventListener('click', function() {
    document.cookie = `temporaryName = ${tempInput.value}; path= /`
    window.location.href = `/room${room}`; 
});
