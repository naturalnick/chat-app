from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from datetime import datetime
import db_access

app = Flask(__name__, static_folder="../client/build/static", template_folder="../client/build")
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

users = [
		{
			"name": "Nick",
			"isOnline": "true",
		},
		{
			"name": "Rob",
			"isOnline": "true",
		},
	]
messages = [
	{
		"id": "1",
		"user": "Nick",
		"text": "Hello World",
	},
	{
		"id": "2",
		"user": "Nick",
		"text": "Second Message",
	},
	{
		"id": "3",
		"user": "Rob",
		"text": "I like to play video games.",
	},
	{
		"id": "4",
		"user": "Rob",
		"text": "This is a second Message",
	},
]

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
	return "Users", 200

@app.route("/api/users", methods=["POST"])
def add_user():
	user_name = request.json["name"]
	date = datetime.now().strftime("%d/%m/%Y")
	#online_status = request.json["isOnline"]
	db_access.create_user(user_name, date)
	#users.append({"id": user_id, "name": user_name})
	return "Users", 201

if __name__=="__main__":
	app.run(debug=True)