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
	return "Messages", 200

@app.route("/api/users", methods=["GET"])
def get_users():
	users = db_access.get_users()
	print(users)
	if "id" in request.args:
		for user in users:
			if user.id == request.args["id"]:
				return user
			else: return "Not Found", 404
	else:
		return jsonify(db_access.get_users())

@app.route("/api/auth/signin", methods=['POST'])
def sign_in():
	username = request.json["username"]
	password_entered = request.json["password"].encode('utf-8')

	user = db_access.get_user(username)
	password_to_compare = user['password'].encode('utf-8')

	if user != None and checkpw(password_entered, password_to_compare):
		payload_data = {"username": username}
		encoded_jwt = jwt.encode(payload_data, "secret", algorithm="HS256")
		#save jwt to database for reference?
		return jsonify({"jwt": encoded_jwt}), 200
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