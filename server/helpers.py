import jwt

def check_jwt(token):
	decoded = jwt.decode(token, "secret", algorithms="HS256")
	return True if decoded else False

def get_jwt_payload(token):
	return jwt.decode(token, "secret", algorithms="HS256")