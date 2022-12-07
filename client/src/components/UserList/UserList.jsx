import ListGroup from "react-bootstrap/ListGroup";
import "./UserList.css";

export default function StatusBar({ users }) {
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
