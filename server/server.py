from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import os
from dotenv import load_dotenv
import db_access as db
from helpers import check_jwt, get_jwt_payload, getToken

load_dotenv()

app = Flask(__name__, static_folder="../client/build", static_url_path="")
app.config["SECRET_KEY"] = os.environ["FLASK_SECRET"]
cors = CORS(app, resources={r"/api": {"origins": "*"}})
cors_header = {"Access-Control-Allow-Origin", "*"}
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def index():
	return app.send_static_file("index.html"), 200


@app.errorhandler(404)
def not_found(e):
	return app.send_static_file("index.html"), 200

@app.errorhandler(400)
def not_found(e):
	return "400 Server - Bad Request", 400	


@app.route("/api/auth/login", methods=["POST"])
def login():
	print(request.json)
	username = request.json["username"]
	password = request.json["password"]
	if db.check_user_exists(username) is False:
		return "Username doesn't exist.", 404
	elif db.check_user_online(username) is True:
		return "User is already logged in.", 403
	elif db.verify_user(username, password):
		return jsonify({"token": getToken(username)}), 200
	else: return "Username or password is incorrect.", 401

@app.route("/api/auth/register", methods=["POST"])
def register():
	username = request.json["username"]
	password = request.json["password"]
	if db.check_user_exists(username):
		return "Username is already taken.", 403
	else:
		db.create_user(username, password)
		return {"token": getToken(username)}, 200


@socketio.on("disconnect")
def disconnected():
	db.set_user_status_offline(request.sid)
	update_users()


@socketio.on("logged_in")
def set_logged_in(token):
	if check_jwt(token):
		payload = get_jwt_payload(token)
		db.set_user_status_online(payload["username"], request.sid)
		update_users()
		send_messages()
	else: emit("request_denied")
    

@socketio.on("logged_out")
def set_logged_out():
	db.set_user_status_offline(request.sid)
	update_users()


@socketio.on("message")
def receive_message(message):
	if check_jwt(message["token"]):
		payload = get_jwt_payload(message["token"])
		db.create_message(payload["username"], message["text"])
		emit("messages", db.get_messages(), broadcast=True)
	else: emit("request_denied")


@socketio.on("test")
def test_relay():
	emit("success")


@socketio.on_error()
def error_handler(e):
	pass

def update_users():
	users = db.get_users()
	emit("user_list", users, broadcast=True)


def send_messages():
	messages = db.get_messages()
	emit("messages", messages)


if __name__=="__main__":
	db.set_all_users_offline() # fail-safe if server crashes - always start with all users offline
	socketio.run(app, debug=True)