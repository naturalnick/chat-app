from flask import Flask, request, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import db_access
import jwt
from helpers import check_jwt, get_jwt_payload, escape_for_sql

app = Flask(__name__, static_folder="../client/build", static_url_path="")
app.config["SECRET_KEY"] = "secret"
CORS(app, resources={r"/api/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*") #change * to url of client

@app.route("/")
def index():
   return app.send_static_file("index.html"), 200

@app.errorhandler(404)
def not_found(e):
	return app.send_static_file("index.html")

@socketio.on("connect")
def client_connect():
	print("client has connected")

@socketio.on("disconnect")
def disconnected():
	db_access.set_user_status_offline(request.sid)
	update_users()

@socketio.on("login_register")
def handle_login(data):
	username = data["username"]
	password = data['password']
	userExists = db_access.check_user(username)
	if userExists and data["type"] == "login":
		send_authorization(username) if db_access.verify_user(username, password) else emit("invalid")
	elif not userExists and data["type"] == "register":
		db_access.create_user(username, password)
		send_authorization(username)
	else:
		emit("invalid")

def send_authorization(username):
	payload = {"username": username}
	encoded_jwt = jwt.encode(payload, "secret", algorithm="HS256")
	emit("authenticate", {"jwt": encoded_jwt})

@socketio.on("logged_in")
def set_logged_in(token):
	if check_jwt(token):
		payload = get_jwt_payload(token)
		username = payload["username"]
		db_access.set_user_status_online(username, request.sid)
		update_users()
	else: emit("request_denied")
    
@socketio.on("logged_out")
def set_logged_out():
	db_access.set_user_status_offline(request.sid)
	update_users()

def update_users():
	users = db_access.get_users()
	emit("user_list", users, broadcast=True)

@socketio.on("retrieve_messages")
def send_messages(token):
	if token and check_jwt(token):
		msgs = db_access.get_messages()
		emit("messages", msgs)
	else: emit("request_denied")

@socketio.on("message")
def receive_message(message):
	if check_jwt(message["token"]):
		payload = get_jwt_payload(message["token"])
		username = payload["username"]
		text = escape_for_sql(message["text"])
		db_access.create_message(username, text)
		msgs = db_access.get_messages()
		emit("messages", msgs, broadcast=True)
	else: emit("request_denied")

if __name__=="__main__":
	socketio.run(app,debug=True)