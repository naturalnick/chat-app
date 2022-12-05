from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from db_access import verify_user, create_user, set_user_status_online, set_user_status_offline, get_users, get_messages, check_user_exists, create_message
from helpers import check_jwt, get_jwt_payload, escape_for_sql, getToken

app = Flask(__name__, static_folder="../client/build", static_url_path="")
app.config["SECRET_KEY"] = "secret"
CORS(app, resources={r"/api/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*") #change * to url of client

@app.route("/")
def index():
   return app.send_static_file("index.html"), 200

@app.route("/api/auth/login", methods=['POST'])
def login():
	username = request.json["username"]
	password = request.json['password']
	if check_user_exists(username) is False:
		return {"Error": "Username doesn't exist."}, 403
	if verify_user(username, password):
		return {"token": getToken(username)}, 200
	else: return {"Error": "Username or password is incorrect."}, 404

@app.route("/api/auth/register", methods=['POST'])
def register():
	username = request.json["username"]
	password = request.json['password']
	if check_user_exists(username):
		return {"Error": "User already exists"}, 403
	else:
		create_user(username, password)
		return {"token": getToken(username)}, 200

@app.errorhandler(404)
def not_found(e):
	return app.send_static_file("index.html")

@socketio.on("disconnect")
def disconnected():
	set_user_status_offline(request.sid)
	update_users()

@socketio.on("logged_in")
def set_logged_in(token):
	if check_jwt(token):
		payload = get_jwt_payload(token)
		username = payload["username"]
		set_user_status_online(username, request.sid)
		update_users()
	else: emit("request_denied")
    
@socketio.on("logged_out")
def set_logged_out():
	set_user_status_offline(request.sid)
	update_users()

@socketio.on("retrieve_messages")
def send_messages(token):
	if token and check_jwt(token):
		msgs = get_messages()
		emit("messages", msgs)
	else: emit("request_denied")

@socketio.on("message")
def receive_message(message):
	if check_jwt(message["token"]):
		payload = get_jwt_payload(message["token"])
		username = payload["username"]
		text = escape_for_sql(message["text"])
		create_message(username, text)
		msgs = get_messages()
		emit("messages", msgs, broadcast=True)
	else: emit("request_denied")

@socketio.on("test")
def test_relay():
	emit("success")

def update_users():
	users = get_users()
	emit("user_list", users, broadcast=True)

if __name__=="__main__":
	socketio.run(app,debug=True)