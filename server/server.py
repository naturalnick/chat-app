from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import os
from dotenv import load_dotenv
import db_access as db
from helpers import check_jwt, get_jwt_payload, generate_token

load_dotenv()

app = Flask(__name__, static_folder="../client/build", static_url_path="")
app.config["SECRET_KEY"] = os.environ["FLASK_SECRET"]
cors = CORS(app, resources={r"/api": {"origins": "*"}})
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
	username = request.json["username"]
	password = request.json["password"]

	if db.check_user_exists(username) is False:
		return "Username doesn't exist.", 404
	elif db.check_user_online(username):
		return "User is already logged in.", 403
	elif db.verify_user(username, password):
		db.set_online_status(username, True)
		socketio.emit("user", {"name": username, "is_online": True}, broadcast=True)
		return jsonify({"token": generate_token(username)}), 200
	else:
		return "Username or password is incorrect.", 401


@app.route("/api/auth/register", methods=["POST"])
def register():
	username = request.json["username"]
	password = request.json["password"]
	if db.check_user_exists(username):
		return "Username is already taken.", 403
	else:
		db.create_user(username, password)
		db.set_online_status(username, True)
		socketio.emit("user", {"name": username, "is_online": True}, broadcast=True)
		return {"token": generate_token(username)}, 200


@app.route("/api/auth/logout", methods=["GET"])
def logout():
	token = request.headers.get("Authorization")
	username = get_jwt_payload(token)["username"]
	db.set_online_status(username, False)
	socketio.emit("user", {"name": username, "is_online": False}, broadcast=True)
	return {}, 200


@app.route("/api/message", methods=["POST"])
def handle_message():
	token = request.headers.get("Authorization")
	if check_jwt(token):
		username = get_jwt_payload(token)["username"]
		message = request.json["message"]
		new_message = db.create_message(username, message)
		socketio.emit("message", new_message, broadcast=True)
		return {}, 200
	return "Request denied.", 401


@app.route("/api/messages", methods=["GET"])
def send_messages():
	if check_jwt(request.headers.get("Authorization")):
		return db.get_messages()
	return "Request denied.", 401


@app.route("/api/users", methods=["GET"])
def send_users():
	if check_jwt(request.headers.get("Authorization")):
		return db.get_users()
	return "Request denied.", 401


if __name__=="__main__":
	db.set_all_users_offline() # fail-safe if server crashes - always start with all users offline
	socketio.run(app, debug=True)