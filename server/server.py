from flask import Flask, request, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import jwt
import db_access

app = Flask(__name__, static_folder="../client/build/static", template_folder="../client/build")
app.config["SECRET_KEY"] = "secret"
CORS(app, resources={r"/api/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*") #change * to url of client

@app.route("/")
def index():
    return render_template("index.html"), 200

# @app.route("/api/messages", methods=["POST"])
# def set_messages():
# 	user_name = request.json["user"]
# 	text = request.json["text"]
# 	date = datetime.now().strftime("%d/%m/%Y %H:%M")
# 	db_access.create_message(user_name, text, date)
# 	return "Messages", 200

def check_jwt(token):
	decoded = jwt.decode(token, "secret", algorithms="HS256")
	return True if decoded else False

def get_jwt_payload(token):
	return jwt.decode(token, "secret", algorithms="HS256")

@socketio.on("connect")
def client_connect():
	emit("connected")

@socketio.on("ping")
def check():
    print("pinged")	
    
@socketio.on("retrieve_users")
def send_users(token):
	if check_jwt(token):
		users = db_access.get_users()
		emit("user_list", users)
	else: emit("request_denied")

@socketio.on("retrieve_messages")
def send_messages(token):
	if token and check_jwt(token):
		msgs = db_access.get_messages()
		emit("messages", msgs, broadcast=True)
	else: emit("request_denied")

@socketio.on("message")
def receive_message(message):
	if check_jwt(message["token"]):
		payload = get_jwt_payload(message["token"])
		username = payload["username"]
		text = message["text"]
		db_access.create_message(username, text)
		msgs = db_access.get_messages()
		emit("messages", msgs, broadcast=True)
	else: emit("request_denied")

@socketio.on("login_register")
def handle_login(data):
	username = data["username"]
	password = data['password']
	userExists = db_access.check_user(username)
	if userExists and data["type"] == "login" and db_access.get_user(username, password):
		payload = {"username": username}
		encoded_jwt = jwt.encode(payload, "secret", algorithm="HS256")
		emit("logged_in", {"jwt": encoded_jwt}, broadcast=True)
	elif not userExists and data["type"] == "login":
		emit("invalid")
	elif userExists and data["type"] == "register":
		emit("invalid")
	elif not userExists and data["type"] == "register":
		print("create new")
		db_access.create_user(username, password)
    
@socketio.on("disconnect")
def disconnected():
    print("user disconnected")
    emit("disconnect",f"user {request.sid} disconnected",broadcast=True)    
    
if __name__=="__main__":
	socketio.run(app,debug=True)
	# app.run(debug=True)