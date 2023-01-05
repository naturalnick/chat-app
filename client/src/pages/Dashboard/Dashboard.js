import { useCallback, useContext, useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import UserList from "../../components/UserList/UserList";
import MessageBox from "../../components/MessageBox/MessageBox";
import StatusBar from "../../components/StatusBar/StatusBar";
import { getMessages, getUsers, logoutUser } from "../../services/API";
import { SocketContext } from "../../context/socket";

export default function Dashboard({ setAuthenticated }) {
	const token = localStorage.getItem("token");
	const socket = useContext(SocketContext);

	const [users, setUsers] = useState([]);
	const [messages, setMessages] = useState([]);

	const logout = useCallback(() => {
		localStorage.removeItem("token");
		setAuthenticated(false);
		logoutUser(token);
	}, [setAuthenticated, token]);

	const loadMessages = useCallback(async () => {
		const response = await getMessages(token);
		if ("error" in response) {
			logout();
		} else {
			setMessages(response);
		}
	}, [logout, token]);

	const loadUsers = useCallback(async () => {
		const response = await getUsers(token);
		if ("error" in response) {
			logout();
		} else {
			setUsers(sortUsers(response));
		}
	}, [token, logout]);

	const handleNewMessage = useCallback((newMessage) => {
		setMessages((prevMessages) => [...prevMessages, newMessage]);
	}, []);

	const handleUserChange = useCallback((updatedUser) => {
		setUsers((prevUsers) => {
			const newUsers = prevUsers.filter(
				(user) => user.name !== updatedUser.name
			);

			return sortUsers([...newUsers, updatedUser]);
		});
	}, []);

	useEffect(() => {
		loadUsers();
		loadMessages();

		socket.on("message", handleNewMessage);
		socket.on("user", handleUserChange);

		return () => {
			socket.off("message");
			socket.off("user");
		};
	}, [
		loadMessages,
		loadUsers,
		handleNewMessage,
		handleUserChange,
		socket,
		token,
	]);

	function sortUsers(userArray) {
		const onlineUsers = userArray
			.filter((user) => user.is_online)
			.sort((user1, user2) => {
				const name1 = user1.name.toUpperCase();
				const name2 = user2.name.toUpperCase();
				if (name1 < name2) return -1;
				if (name1 > name2) return 1;
				return 0;
			});
		const offlineUsers = userArray
			.filter((user) => !user.is_online)
			.sort((user1, user2) => {
				const name1 = user1.name.toUpperCase();
				const name2 = user2.name.toUpperCase();
				if (name1 < name2) return -1;
				if (name1 > name2) return 1;
				return 0;
			});
		return onlineUsers.concat(offlineUsers);
	}

	return (
		<Container>
			<StatusBar logout={logout} token={token} />
			<Row className="g-0">
				<Col md={9}>
					<MessageBox messages={messages} token={token} />
				</Col>
				<Col md={3}>
					<UserList users={users} />
				</Col>
			</Row>
		</Container>
	);
}
