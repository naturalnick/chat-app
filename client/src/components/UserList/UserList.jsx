import { useEffect, useState, useContext } from "react";
import { SocketContext } from "../../context/Socket";
import ListGroup from "react-bootstrap/ListGroup";
import "./UserList.css";

export default function StatusBar() {
	const socket = useContext(SocketContext);

	const [users, setUsers] = useState([]);

	useEffect(() => {
		socket.on("user_list", (users) => {
			setUsers(users);
		});
		return () => {
			socket.off("user_list");
		};
	}, [socket]);

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
		<ListGroup variant="flush" className="user-list">
			<div className="list-title">Users</div>
			{userElements}
		</ListGroup>
	);
}
