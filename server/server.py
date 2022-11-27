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

# @app.route("/api/users", methods=["GET"])
# def get_users():
# 	users = db_access.get_users()
# 	print(check_jwt(request.headers["Authorization"]))
# 	if "id" in request.args:
# 		for user in users:
# 			if user.id == request.args["id"]:
# 				return user
# 			else: return "Not Found", 404
# 	else:
# 		return jsonify(db_access.get_users())

def check_jwt(token):
	decoded = jwt.decode(token, "secret", algorithms="HS256")
	return True if decoded else False

# @app.route("/api/auth/signin", methods=['POST'])
# def sign_in():
# 	print("got here")
# 	username = request.json["username"]
# 	password_entered = request.json["password"].encode('utf-8')
# 	user = db_access.get_user(username)
# 	print(user)
# 	password_to_compare = user['password'].encode('utf-8')

# 	if user != None and check_pw(password_entered, password_to_compare):
# 		payload = {"username": username}
# 		encoded_jwt = jwt.encode(payload, "secret", algorithm="HS256")
# 		return jsonify({"jwt": encoded_jwt}), 200
# 	else:
# 		return jsonify({"data": "None"}), 200

# @app.route("/api/auth/signup", methods=['POST'])
# def sign_up():
# 	username = request.json["username"]
# 	password = request.json["password"]

# 	if db_access.get_user(username) != None:
# 		return jsonify({"data": "user already exists"}), 409
# 	elif username and password:
# 		db_access.create_user(username, password)
# 	return jsonify({"data": "None"}), 200

@socketio.on("connect")
def connected():
	print("client has connected")

@socketio.on("ping")
def handle_messages():
    print("pinged")	
    
@socketio.on("retrieve_users")
def send_users(token):
	if check_jwt(token):
		users = db_access.get_users()
		emit("user_list", users)

@socketio.on("retrieve_msgs")
def send_messages(token):
	if check_jwt(token):
		msgs = db_access.get_messages()
		emit("messages", msgs)

@socketio.on("login_register")
def handle_message(data):
	print(data)
	username = data["username"]
	password = data['password']
	user = db_access.get_user(username, password)
	if user != None and data["type"] == "login":
		payload = {"username": username}
		encoded_jwt = jwt.encode(payload, "secret", algorithm="HS256")
		emit("logged_in", {"jwt": encoded_jwt}, broadcast=True)
	elif user == None and data["type"] == "register":#and type is register
		db_access.create_user(username, password)
    
@socketio.on("disconnect")
def disconnected():
    print("user disconnected")
    emit("disconnect",f"user {request.sid} disconnected",broadcast=True)    
    
if __name__=="__main__":
	socketio.run(app,debug=True)
	# app.run(debug=True)