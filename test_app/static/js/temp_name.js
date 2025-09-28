const tempButton = document.querySelector(".submit-btn");
const tempInput = document.querySelector(".input-name");

const room = window.room;

tempButton.addEventListener('click', function() {
    console.log(tempInput.value)
    document.cookie = `temporary_name = ${tempInput.value}; path= /`
    console.log(`Кнопка нажата! /room${room}`);

    window.location.href = `/room${room}`; 
});
