import { useEffect, useState } from "react";
import io from "socket.io-client";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import UserList from "../../components/UserList/UserList";
import MessageBox from "../../components/MessageBox/MessageBox";
import StatusBar from "../../components/StatusBar/StatusBar";

const socket = io();

export default function Dashboard({ setAuthenticated }) {
	const token = localStorage.getItem("authentication");

	const [users, setUsers] = useState([]);
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		socket.on("request_denied", () => {
			logout();
		});
		socket.on("user_list", (users) => {
			setUsers(users);
		});
		socket.on("messages", (messages) => {
			setMessages(messages);
		});
		socket.emit("logged_in", token);
		return () => {
			socket.off("request_denied");
			socket.off("user_list");
			socket.off("messages");
		};
	}, []);

	function logout() {
		localStorage.removeItem("authentication");
		setAuthenticated(false);
		socket.emit("logged_out");
		socket.disconnect();
	}

	return (
		<Container>
			<StatusBar logout={logout} token={token} />
			<Row className="g-0">
				<Col md={9}>
					<MessageBox messages={messages} socket={socket} token={token} />
				</Col>
				<Col md={3}>
					<UserList users={users} />
				</Col>
			</Row>
		</Container>
	);
}
