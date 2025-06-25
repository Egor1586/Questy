import flask
from flask import request, make_response

def clear_cookies(non_clear_cookie: list = 'None'):
    r'''
    ### Функция которая будет чистить `ВСЕ` куки которые есть ###
    
    #### Параметры: ####
    - non_clear_cookie — `СПИСОК` куков, которые не должны удаляться

    #### Возвращает response куков ####
    '''
    response = make_response('Все куки очищены')
    for cookie in request.cookies.keys():
        if cookie not in non_clear_cookie and cookie != 'session':
            response.delete_cookie(cookie)
    return response