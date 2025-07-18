const tempButton = document.querySelectorAll(".temp_button")
const tempInput = document.querySelectorAll(".temp_input")

console.log("ah;gdf")

tempButton.addEventListener('click', function() {
    console.log(tempInput.value)
    document.cookie = `teporary_name = ${tempInput.value}; path= /`
    console.log('Кнопка нажата!');
});