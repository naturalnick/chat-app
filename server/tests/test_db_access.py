import unittest
import sys

sys.path.append("../")
from db_access import *

# make sure a user named "test" exists in the database

class DB_Access_Test(unittest.TestCase):

	def test_check_user_exists(self):
		self.assertTrue(check_user_exists("test"))

	def test_getting_users(self):
		users = get_users()
		self.assertIsNotNone(users)

		users_keys = list(users[0].keys())
		self.assertEqual(users_keys[0], "name")
		self.assertEqual(users_keys[1], "is_online")

		users_values = list(users[0].values())
		self.assertTrue(type(users_values[0]) is str)
		self.assertTrue(type(users_values[1]) is bool)

	def test_messaging(self):
		create_message("test", "Greetings! This is a test message sent from the server.")
		msgs = get_messages()
		self.assertIsNotNone(msgs)

		last_msg_posted = msgs[len(msgs) - 1]
		self.assertIn("Greetings!", last_msg_posted.get("text"))

		msg_keys = list(msgs[0].keys())
		self.assertEqual(msg_keys[0], "id")
		self.assertEqual(msg_keys[1], "username")
		self.assertEqual(msg_keys[2], "text")
		self.assertEqual(msg_keys[3], "date_created")

		msg_values = list(msgs[0].values())
		self.assertTrue(type(msg_values[0]) is int)
		self.assertTrue(type(msg_values[1]) is str)
		self.assertTrue(type(msg_values[2]) is str)
		self.assertTrue(type(msg_values[3]) is str)

		