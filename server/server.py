from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from datetime import datetime
from bcrypt import hashpw, checkpw, gensalt
import jwt
import db_access

app = Flask(__name__, static_folder="../client/build/static", template_folder="../client/build")
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route("/")
def index():
    return render_template("index.html"), 200

@app.route("/api/messages", methods=["GET"])
def get_messages():
	return jsonify(db_access.get_messages()), 200

@app.route("/api/messages", methods=["POST"])
def set_messages():
	user_name = request.json["user"]
	text = request.json["text"]
	date = datetime.now().strftime("%d/%m/%Y %H:%M")
	db_access.create_message(user_name, text, date)
	#messages.append({"id": len(messages) + 1, "user": user_name, "text": text})
	return "Messages", 200

@app.route("/api/users", methods=["GET"])
def get_users():
	if "id" in request.args:
		for user in users:
			if user.id == request.args["id"]:
				return user
			else: return "Not Found", 404
	else:
		return jsonify(db_access.get_users())

@app.route("/api/users", methods=["POST"])
def add_user():
	user_name = request.json["name"]
	#online_status = request.json["isOnline"]
	db_access.create_user(user_name)
	#users.append({"id": user_id, "name": user_name})
	return "Users", 201

@app.route("/api/auth/signin", methods=['POST'])
def sign_in():
	username = request.json["username"]
	password = request.json["password"]
	user = db_access.get_user(username)
	# Check that a user matching the username exists, and that the password matches
	if user != None and checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
		print("set JWT")
		payload_data = {"username": username, "password": password}
		encoded_jwt = jwt.encode(payload_data, "secret", algorithm="HS256")
		return jsonify({"data": "None"}), 200
	else:
		return jsonify({"data": "None"}), 200

@app.route("/api/auth/signup", methods=['POST'])
def sign_up():
	username = request.json["username"]
	email = request.json["email"]
	password = request.json["password"]
	if db_access.get_user(username) != None:
		return jsonify({"data": "None"}), 409
	if username and password:
		db_access.create_user(username, password)
	return jsonify({"data": "None"}), 200

if __name__=="__main__":
	app.run(debug=True)