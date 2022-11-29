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
			token.emit("logged_in", token);
		});
		socket.on("request_denied", () => {
			revokeAccess();
		});
		socket.on("disconnect", () => {
			token.emit("logged_out", token);
		});
		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("pong");
		};
	}, []);

	function revokeAccess() {
		setToken(null);
		localStorage.removeItem("authentication");
		//Display to user access denied?
	}

	return (
		<div className="App">
			{!token && <Navigate to="/login" replace={true} />}
			<Container>
				<Row>
					<Col md={9}>
						<h2>Messages</h2>
						<MessageBox token={token} />
						<MessageBar token={token} />
					</Col>
					<Col md={3}>
						<StatusBar token={token} />
					</Col>
				</Row>
			</Container>
		</div>
	);
}
