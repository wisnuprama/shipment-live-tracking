
def validate_chat_message(data: dict):
    if data.get('message') and data.get('username'):
        return True
    return False
