import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import "./StatusBar.css";

export default function StatusBar({ logout, token }) {
	const [name, setName] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("authentication");
		if (token) {
			const username = jwt_decode(token).username;
			setName(username);
		}
	}, []);

	return (
		<Navbar expand="md">
			<Container fluid>
				<h1 className="dashboard-title">Burble</h1>
				<Navbar.Toggle aria-controls="statusBar" />
				<Navbar.Collapse className="justify-content-end">
					<Nav>
						<Navbar.Text className="user-status">
							Logged in as: <span className="user">{name}</span>
						</Navbar.Text>
						<Button
							style={{ borderRadius: "0" }}
							onClick={logout}
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
