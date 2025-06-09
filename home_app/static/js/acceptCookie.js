const socket = io();

socket.on('send_cookie', function accept_cookie(cookie_data){
    const cookie = cookie_data.cookie;
    let list_ids = document.cookie.split('=')[1];

    document.cookie = `list_users_id = ${list_ids}|; path= /`

})