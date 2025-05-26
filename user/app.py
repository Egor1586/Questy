import flask 

sign_up_app = flask.Blueprint(
    name= 'sign_up_app',
    import_name= "user",
    static_folder= 'static',
    template_folder= 'templates',
    static_url_path= '/user/static/'
)