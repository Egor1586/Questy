from flask_mail import Message
from Project.settings import mail  

def send_code(user_email: str, code: int):
    print(f"Отправка письма на {user_email}")
    message = Message(
        subject="Код для відновлення паролю",
        sender="egor115819@gmail.com", 
        recipients=[user_email]
    )
    
    message.body = f"It's your code for password recovery: {code}"
    mail.send(message)
