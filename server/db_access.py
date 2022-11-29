import psycopg2
from datetime import datetime

conn = psycopg2.connect("dbname=chat_app user=postgres host=localhost password=$CH&&fer")

def get_users():
	with conn.cursor() as cur:
		cur.execute("SELECT name FROM users ORDER BY name")
		records = cur.fetchall()
	users = []
	for record in records:
		user_dict = dict(name = record[0])
		users.append(user_dict)
	return users

def create_user(username, password):
	date = datetime.now().strftime("%m/%d/%Y")
	with conn.cursor() as cur:
		cur.execute(f"INSERT INTO users (name, date_created, password) VALUES('{username}','{date}', crypt('{password}', gen_salt('bf')))")
	conn.commit()

def get_user(username, password):
	with conn.cursor() as cur:
		cur.execute(f"SELECT * FROM users WHERE name = '{username}' AND password = crypt('{password}', password)")
		return True if cur.fetchone() != None else False
	
def check_user(username):
	with conn.cursor() as cur:
		cur.execute(f"SELECT name FROM users WHERE name = '{username}'")
		return True if cur.fetchone() != None else False

def get_messages():
	with conn.cursor() as cur:
		cur.execute("SELECT * FROM messages ORDER BY id")
		records = cur.fetchall()
	messages = []
	for record in records:
		msg_dict = dict(id = record[0], username = record[1], text = record[2], date_created = record[3])
		messages.append(msg_dict)
	return messages

def create_message(username, text):
	date = datetime.now().strftime("%m/%d/%Y")
	with conn.cursor() as cur:
		cur.execute(f"INSERT INTO messages (username,text,date_created) VALUES('{username}','{text}','{date}')")
		conn.commit()