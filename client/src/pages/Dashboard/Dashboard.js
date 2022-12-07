import { useCallback, useContext, useEffect, useState } from "react";
import { TokenContext } from "../../context/Token";
import { SocketContext } from "../../context/Socket";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import UserList from "../../components/UserList/UserList";
import MessageBox from "../../components/MessageBox/MessageBox";
import StatusBar from "../../components/StatusBar/StatusBar";

export default function Dashboard({ setToken }) {
	const [users, setUsers] = useState([]);
	const [messages, setMessages] = useState([]);
	const socket = useContext(SocketContext);
	const token = useContext(TokenContext);

	const logout = useCallback(() => {
		localStorage.removeItem("authentication");
		setToken(null);
		socket.emit("logged_out");
		socket.disconnect();
	}, [setToken, socket]);

	useEffect(() => {
		socket.emit("logged_in", token);

		socket.on("request_denied", () => {
			logout();
		});
		socket.on("user_list", (users) => {
			setUsers(users);
		});
		socket.on("messages", (messages) => {
			setMessages(messages);
		});
		return () => {
			socket.off("request_denied");
			socket.off("user_list");
		};
	}, [logout, socket, token]);

	return (
		<Container>
			<StatusBar logout={logout} />
			<Row className="g-0">
				<Col md={9}>
					<MessageBox messages={messages} />
				</Col>
				<Col md={3}>
					<UserList users={users} />
				</Col>
			</Row>
		</Container>
	);
}
