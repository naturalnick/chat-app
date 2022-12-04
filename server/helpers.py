import jwt

def check_jwt(token):
	decoded = jwt.decode(token, "secret", algorithms="HS256")
	return True if decoded else False

def get_jwt_payload(token):
	return jwt.decode(token, "secret", algorithms="HS256")

def escape_for_sql(text):
	newText = text
	chars_to_escape = ["\"", "\'"]
	for char in chars_to_escape:
		newText = newText.replace(char, f"{char}{char}")
	return newText

def remove_sql_escapes(text):
	newText = text
	chars_to_escape = ["\"\"", "\'\'"]
	for char in chars_to_escape:
		newText = newText.replace(char, f"{char[0]}")
	return newText