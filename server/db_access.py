import psycopg2
from datetime import datetime

conn = psycopg2.connect("dbname=chat_app user=postgres host=localhost password=$CH&&fer")

def get_users():
	with conn.cursor() as cur:
		cur.execute("SELECT user_name FROM users ORDER BY user_name")
		records = cur.fetchall()
	users = []
	for record in records:
		user_dict = dict(user_name = record[0])
		users.append(user_dict)
	return users

def create_user(user_name, password):
	date = datetime.now().strftime("%m/%d/%Y")
	with conn.cursor() as cur:
		cur.execute(f"INSERT INTO users (user_name, date_created, password) VALUES('{user_name}','{date}', crypt('{password}', gen_salt('bf')))")
	conn.commit()

def get_user(user_name):
	try:
		with conn.cursor() as cur:
			cur.execute(f"SELECT * FROM users WHERE user_name = '{user_name}'")
			user = cur.fetchone()
			userDict = dict(id = user[0], username = user[1], date_created = user[2], password = user[3])
		return userDict
	except:
		return None

def get_messages():
	with conn.cursor() as cur:
		cur.execute("SELECT * FROM messages ORDER BY id")
		records = cur.fetchall()
	print(records)
	messages = []
	for record in records:
		msg_dict = dict(id = record[0], user_id = record[1], text = record[2], date_created = record[3])
		messages.append(msg_dict)
	return messages

def create_message(user_name, text, date):
	user_id = get_user(user_name["id"])
	with conn.cursor() as cur:
		cur.execute(f"INSERT INTO messages (user_id, text, date_created) VALUES('{user_id}','{text}' '{date}')")