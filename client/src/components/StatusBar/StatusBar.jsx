import { useEffect } from "react";
import { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";

export default function StatusBar() {
	const [users, setUsers] = useState([]);
	function getUsers() {
		fetch("http://127.0.0.1:5000/api/users", { method: "GET" })
			.then((response) => response.json())
			.then((data) => setUsers(data))
			.catch((error) => {
				console.log("Error: ", error);
			});
	}

	useEffect(() => {
		getUsers();
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
