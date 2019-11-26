

def parseValidationErrToDict(message: str):
    key, value = message.split(' - ')
    return {key: value}
