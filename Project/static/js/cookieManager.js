function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value){
    let updateCookie= encodeURIComponent(name)+ "="+ encodeURIComponent(value)
    document.cookie= `${updateCookie}; path=/`
}

function clearCookie(nameList){
    nameList.forEach(name => {     
        if (!getCookie(name)){
            return
        }
        document.cookie= `${encodeURIComponent(name)}=; max-age=0; path=/`
    });
}