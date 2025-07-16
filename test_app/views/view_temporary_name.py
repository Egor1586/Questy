import flask

from flask_login import current_user
from Project.render_page import render_page
from Project.clear_cookie import clear_cookies

def render_temporary_name(code):
    print("temporary name")
    temp_name = flask.render_template(
        'temporary_name.html',
        is_authorization = current_user.is_authenticated,
        username = current_user.username if current_user.is_authenticated else "", 
        is_teacher= current_user.is_teacher if current_user.is_authenticated else "",
        is_admin = current_user.is_admin if current_user.is_authenticated else ""
        )
    
    if flask.request.method == "POST":   
        name = flask.request.form["temporary-name"]
        print(name)
        responce = flask.make_response()
        responce.set_cookie("temporary_name", name)
        
        response.set_cookie(key= "temporary_name", value=f"{name}", max_age=0) 
        return flask.redirect(f"/room{code}")
    
    response = clear_cookies(non_clear_cookie= "user_answers", maked_response= temp_name)
    
    return response