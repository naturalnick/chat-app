import unittest
import json
import sys

sys.path.append("../")
from server import app, socketio

class ServerTest(unittest.TestCase):

	def setUp(self):
		self.test_client = app.test_client(self)
		self.socketio_test_client = socketio.test_client(self.test_client)

		socketio.emit("ping")
		

	def test_index_status(self):
		response = self.test_client.get("/")
		status_code = response.status_code

		self.assertEqual(status_code, 200)


	def test_login_with_valid_credentials(self):
		payload = {"username": "test", "password": "test"}
		response = self.test_client.post("/api/auth/login", content_type="application/json", data=json.dumps(payload))
		status_code = response.status_code

		self.assertEqual(status_code, 200)
		self.assertEqual(response.content_type, "application/json")
		self.assertTrue("token" in response.json)


	def test_login_with_invalid_credentials(self):
		payload = {"username": "test", "password": "wrongpass"}
		response = self.test_client.post("/api/auth/login", content_type="application/json", data=json.dumps(payload))
		
		self.assertEqual(response.status_code, 401)
		self.assertEqual(response.content_type, "application/json")
		self.assertTrue("error" in response.json)


	def test_register_with_existing_credentials(self):
		payload = {"username": "test", "password": "test"}
		response = self.test_client.post("/api/auth/register", content_type="application/json", data=json.dumps(payload))
		status_code = response.status_code

		self.assertEqual(status_code, 403)
		self.assertEqual(response.content_type, "application/json")
		self.assertTrue("error" in response.json)


	def test_socket_connection(self):
		self.assertTrue(self.socketio_test_client.is_connected())
	

	def test_received_ping(self):
		response = self.socketio_test_client.get_received()
		self.assertEqual(response[0].get("name"), "ping")


	def tearDown(self) -> None:
		return super().tearDown()

if __name__=="__main__":
	unittest.main()