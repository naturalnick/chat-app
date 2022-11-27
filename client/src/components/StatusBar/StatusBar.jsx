import { useEffect, useState, useContext } from "react";
import { SocketContext } from "../../context/socket";
import ListGroup from "react-bootstrap/ListGroup";

export default function StatusBar({ token }) {
	const [users, setUsers] = useState([]);
	const socket = useContext(SocketContext);
	useEffect(() => {
		socket.on("user_list", (users) => {
			setUsers(users);
		});
		socket.emit("retrieve_users", token);
	}, []);

	const userElements = users.map((user) => (
		<ListGroup.Item key={user.user_name}>{user.user_name}</ListGroup.Item>
	));

	return (
		<div className="status-bar">
			<h2>Users</h2>
			<ListGroup>{userElements}</ListGroup>
		</div>
	);
}
