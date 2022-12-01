import { useEffect, useState, useContext } from "react";
import { SocketContext } from "../../context/Socket";
import { TokenContext } from "../../context/Token";
import ListGroup from "react-bootstrap/ListGroup";
import "./StatusBar.css";

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
		<ListGroup.Item key={user.name}>
			<span
				className="status-dot"
				style={{ backgroundColor: user.is_online ? "green" : "grey" }}
			></span>
			{user.name}
		</ListGroup.Item>
	));

	return (
		<div>
			<h2>Users</h2>
			<ListGroup>{userElements}</ListGroup>
		</div>
	);
}
