from flask_mail import Message
from Project.settings import mail  

def send_code(user_email: str, code: int, type: str):
    print(f"Отправка письма на {user_email}")
    text= "Код для підтвердження паролю"
    if type == "reset":
        text= "Код для відновлення паролю"
    message = Message(
        subject= text,
        sender="egor115819@gmail.com", 
        recipients=[user_email]
    )
    
    message.body = f"Це ваш код: {code}"
    mail.send(message)
