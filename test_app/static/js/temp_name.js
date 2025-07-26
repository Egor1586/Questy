const tempButton = document.querySelector(".temp_button");
const tempInput = document.querySelector(".temp_input");

const room = window.room;

tempButton.addEventListener('click', function() {
    console.log(tempInput.value)
    document.cookie = `temporary_name = ${tempInput.value}; path= /`
    console.log(`Кнопка нажата! /room${room}`);

    window.location.href = `/room${room}`; 
});