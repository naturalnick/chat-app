import psycopg2
from datetime import datetime
import pytz
from helpers import remove_sql_escapes, escape_for_sql
import os
from dotenv import load_dotenv
load_dotenv()

host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
dbname = os.getenv("DB_NAME")
username = os.getenv("DB_USERNAME")
password = os.getenv("DB_PASSWORD")

conn = psycopg2.connect(host=host, port=port, dbname=dbname, user=username, password=password)

def create_tables():
	with conn.cursor() as cur:
		cur.execute(open("init.sql", "r").read())

create_tables()

def get_users():
	with conn.cursor() as cur:
		cur.execute("SELECT name, is_online FROM users")
		records = cur.fetchall()
	return [{"name": record[0], "is_online": record[1]} for record in records]


def create_user(username, password):
	date = datetime.now().strftime("%m/%d/%Y")
	with conn.cursor() as cur:
		cur.execute(f"INSERT INTO users (name, date_created, password, is_online) VALUES('{username}','{date}', crypt('{password}', gen_salt('bf')), false)")
		conn.commit()


def verify_user(username, password):
	with conn.cursor() as cur:
		cur.execute(f"SELECT name FROM users WHERE name = '{username}' AND password = crypt('{password}', password)")
		record = cur.fetchone()
		return False if record is None else True
	

def check_user_online(username):
	with conn.cursor() as cur:
		cur.execute(f"SELECT name FROM users WHERE name = '{username}' AND is_online = true")
		record = cur.fetchone()
		return False if record is None else True


def check_user_exists(username):
	with conn.cursor() as cur:
		cur.execute(f"SELECT name FROM users WHERE name = '{username}'")
		record = cur.fetchone()
		return False if record is None else True


def get_messages():
	with conn.cursor() as cur:
		cur.execute("SELECT * FROM messages ORDER BY id")
		records = cur.fetchall()
	return [{"id": record[0], "username": record[1], "text": record[2], "date_created": record[3]} for record in records]


def create_message(username, text):
	date = str(datetime.now().astimezone(pytz.utc))
	with conn.cursor() as cur:
		cur.execute(f"INSERT INTO messages (username,text,date_created) VALUES('{username}','{escape_for_sql(text)}','{date}')")
		conn.commit()

		cur.execute(f"SELECT * FROM messages WHERE date_created = '{date}'")
		record = cur.fetchone()

	return {"id": record[0], "username": record[1], "text": remove_sql_escapes(record[2]), "date_created": record[3]}


def set_online_status(username, new_status):
	with conn.cursor() as cur:
		cur.execute(f"UPDATE users SET is_online = {new_status} WHERE name = '{username}'")
		conn.commit()


def set_all_users_offline():
	with conn.cursor() as cur:
		cur.execute(f"UPDATE users SET is_online = false")
		conn.commit()