import psycopg2

conn = psycopg2.connect("dbname=chat_app user=postgres host=localhost password=$CH&&fer")

def get_users():
	with conn.cursor() as cur:
		cur.execute("SELECT * FROM users ORDER BY user_name")
		records = cur.fetchall()
	users = []
	for record in records:
		user_dict = dict(id = record[0], user_name = record[1], date_created = record[2])
		users.append(user_dict)
	return users

def create_user(user_name, date):
	with conn.cursor() as cur:
		cur.execute(f"INSERT INTO users (user_name, date_created) VALUES('{user_name}','{date}')")
	conn.commit()

def get_user_id(user_name):
	try:
		with conn.cursor() as cur:
			cur.execute(f"SELECT id FROM users WHERE user_name = '{user_name}'")
			user_id = cur.fetchone()
		return user_id
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
	user_id = get_user_id(user_name)
	with conn.cursor() as cur:
		cur.execute(f"INSERT INTO messages (user_id, text, date_created) VALUES('{user_id}','{text}' '{date}')")