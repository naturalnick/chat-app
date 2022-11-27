import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { SocketContext } from "./context/socket";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import MessageBar from "./components/MessageBar/MessageBar";
import StatusBar from "./components/StatusBar/StatusBar";
import MessageBox from "./components/MessageBox/MessageBox";
import "./App.css";

export default function App() {
	const socket = useContext(SocketContext);
	// const [isLogginIn, setIsLoggedIn] = useState(false);
	const [token, setToken] = useState(() => {
		return localStorage.getItem("authentication");
	});

	useEffect(() => {
		socket.on("connected", () => {
			console.log("client connected");
		});
		socket.on("invalid", () => {
			setToken(null);
			localStorage.removeItem("authentication");
		});
		socket.on("disconnect", () => {
			//do something?
		});
		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("pong");
		};
	}, []);

	function sendMessage() {
		fetch("http://127.0.0.1:5000/api/messages", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				headers: { Authorization: `Bearer ${token}` },
			},
			body: JSON.stringify({ id: 78912 }),
		})
			.then((response) => response.json())
			.then((response) => console.log(JSON.stringify(response)))
			.catch((error) => {
				console.log("Error: ", error);
			});
	}

	return (
		<div className="App">
			{!token && <Navigate to="/login" replace={true} />}
			<Container>
				<Row>
					<Col md={4}>
						<StatusBar token={token} />
					</Col>
					<Col md={8}>
						<h2>Messages</h2>
						<MessageBox token={token} />
						<MessageBar token={token} />
					</Col>
				</Row>
			</Container>
		</div>
	);
}
