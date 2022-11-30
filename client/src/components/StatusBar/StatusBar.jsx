import { useEffect, useState, useContext } from "react";
import { SocketContext } from "../../context/Socket";
import { TokenContext } from "../../context/Token";
import ListGroup from "react-bootstrap/ListGroup";

export default function StatusBar() {
	const [users, setUsers] = useState([]);
	const socket = useContext(SocketContext);
	const token = useContext(TokenContext);
	useEffect(() => {
		socket.on("user_list", (users) => {
			setUsers(users);
		});
		socket.emit("retrieve_users", token);
	}, []);

	const userElements = users.map((user) => (
		<ListGroup.Item key={user.name}>{user.name}</ListGroup.Item>
	));

	return (
		<div>
			<h1>Users</h1>
			<ListGroup>{userElements}</ListGroup>
		</div>
	);
}
