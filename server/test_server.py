import requests
import json
from server import app, socketio

# # check login endpoint
# def test_login():
# 	login_url = "http://127.0.0.1:5000/api/auth/login"
# 	headers = {"Content-Type": "application/json"}
# 	payload = {"username": "test", "password": "test"}
# 	response = requests.post(login_url, headers=headers, data=json.dumps(payload))
# 	assert response.status_code == 200
# 	assert "token" in response.json()

# # check register endpoint
# def test_register():
# 	register_url = "http://127.0.0.1:5000/api/auth/register"
# 	headers = {"Content-Type": "application/json"}
# 	payload = {"username": "test", "password": "test"}
# 	response = requests.post(register_url, headers=headers, data=json.dumps(payload))
# 	assert response.status_code == 403


def test_socketio():
	flask_test_client = app.test_client()
	socketio_test_client = socketio.test_client(flask_test_client)

	assert socketio_test_client.is_connected()

	
	data = {"username": "test", "password": "test"}
	response = flask_test_client.post("/api/auth/login", data=data)
	assert response.status_code == 200