import ListGroup from "react-bootstrap/ListGroup";

export default function StatusBar({ users }) {
	const userElements = users.map((user) => (
		<ListGroup.Item key={user.name}>{user.name}</ListGroup.Item>
	));

	return (
		<div className="status-bar">
			<h2>Users</h2>
			<ListGroup>{userElements}</ListGroup>
		</div>
	);
}
