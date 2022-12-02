import { useContext, useState, useEffect } from "react";
import { TokenContext } from "../../context/Token";
import jwt_decode from "jwt-decode";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import "./StatusBar.css";

export default function StatusBar({ handleLogout }) {
	const token = useContext(TokenContext);
	const [name, setName] = useState("");

	useEffect(() => {
		setName(getUsersName());
	}, []);

	function getUsersName() {
		const payload = jwt_decode(token);
		return payload.username;
	}
	return (
		<Navbar expand="md">
			<Container fluid>
				<h1>Chatroom</h1>
				<Navbar.Toggle aria-controls="statusBar" />
				<Navbar.Collapse className="justify-content-end">
					<Nav>
						<Navbar.Text className="user-status">
							Logged in as: <span className="user">{name}</span>
						</Navbar.Text>
						<Button
							style={{ borderRadius: "0" }}
							onClick={handleLogout}
							variant="outline-danger"
						>
							Logout
						</Button>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
