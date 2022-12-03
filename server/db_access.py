import psycopg2
from datetime import datetime

conn = psycopg2.connect("dbname=chat_app user=postgres host=localhost password=$CH&&fer")

def get_users():
	with conn.cursor() as cur:
		cur.execute("SELECT name, is_online FROM users ORDER BY is_online DESC, name ASC")
		records = cur.fetchall()
	users = []
	for record in records:
		user_dict = dict(name = record[0], is_online = record[1])
		users.append(user_dict)
	return users

def create_user(username, password):
	date = datetime.now().strftime("%m/%d/%Y")
	with conn.cursor() as cur:
		cur.execute(f"INSERT INTO users (name, date_created, password, is_online, session_id) VALUES('{username}','{date}', crypt('{password}', gen_salt('bf')), false)")
		conn.commit()

def verify_user(username, password):
	with conn.cursor() as cur:
		cur.execute(f"SELECT name FROM users WHERE name = '{username}' AND password = crypt('{password}', password)")
		record = cur.fetchone()
		return False if record is None else True
	
def check_user(username):
	with conn.cursor() as cur:
		cur.execute(f"SELECT name FROM users WHERE name = '{username}'")
		record = cur.fetchone()
		return False if record is None else True

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
	date = datetime.now().strftime("%m/%d/%y %H:%M %Z")
	print(date)
	with conn.cursor() as cur:
		cur.execute(f"INSERT INTO messages (username,text,date_created) VALUES('{username}','{text}','{date}')")
		conn.commit()

def set_user_status_online(username, session_id):
	with conn.cursor() as cur:
		cur.execute(f"UPDATE users SET is_online = true WHERE name = '{username}'")
		cur.execute(f"UPDATE users SET session_id = '{session_id}' WHERE name = '{username}'")
		conn.commit()

def set_user_status_offline(session_id):
	with conn.cursor() as cur:
		cur.execute(f"SELECT name FROM users WHERE session_id = '{session_id}'")
		record = cur.fetchone()
		if record is not None:
			username = record[0]
			cur.execute(f"UPDATE users SET is_online = false WHERE name = '{username}'")
			cur.execute(f"UPDATE users SET session_id = null WHERE name = '{username}'")
			conn.commit()