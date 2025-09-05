from Project.render_page import render_page

@render_page(template_name = 'courses.html')
def render_class_courses(id):
    
    print(id)
    
    return {}