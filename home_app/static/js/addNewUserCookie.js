const listButtonStart = document.querySelectorAll('.btn')

let author = document.querySelectorAll('author')

for(let count= 0; count < listButtonStart.length; count++){
    let button = listButtonStart[count]
    button.addEventListener(
        type= 'click',
        listener= function (event){
            document.cookie = `list_members = ; path = /`
        }
    )
}