import { useEffect, useState, useContext } from "react";
import { SocketContext } from "../../context/socket";
import ListGroup from "react-bootstrap/ListGroup";
import Accordion from "react-bootstrap/Accordion";

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
		<ListGroup.Item key={user.name}>{user.name}</ListGroup.Item>
	));

	return (
		<Accordion defaultActiveKey="0">
			<Accordion.Item eventKey="0">
				<Accordion.Header>Users</Accordion.Header>
				<Accordion.Body>
					<ListGroup variant="flush">{userElements}</ListGroup>
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
	);
}
