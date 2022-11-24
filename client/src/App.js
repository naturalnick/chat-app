import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./App.css";
import SearchBar from "./components/SearchBar/SearchBar";
import StatusBar from "./components/StatusBar/StatusBar";
import MessageBox from "./components/MessageBox/MessageBox";
import Login from "./components/Login/Login";

export default function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(
		localStorage.getItem(localStorage.getItem("authenticated") || false)
	);
	const [messages, setMessages] = useState([]);

	function getMessages() {
		fetch("http://127.0.0.1:5000/api/messages", { method: "GET" })
			.then((response) => response.json())
			.then((data) => console.log(data))
			.catch((error) => {
				console.log("Error: ", error);
			});
	}

	useEffect(() => {
		if (localStorage.getItem("authenticated")) {
			setIsLoggedIn(true);
		}
		// getMessages();
	}, []);

	function sendMessage() {
		fetch("http://127.0.0.1:5000/api/messages", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: 78912 }),
		})
			.then((response) => response.json())
			.then((response) => console.log(JSON.stringify(response)))
			.catch((error) => {
				console.log("Error: ", error);
			});
	}

	function handleSubmit(message) {
		setMessages((prevMessages) => [
			...prevMessages,
			{ id: 345634634, user: "Nick", text: message },
		]);
	}
	console.log("render");
	if (!isLoggedIn) {
		return <Navigate replace to="/login" />;
	} else {
		return (
			<div className="App">
				<Login />
				<Container>
					<Row>
						<Col md={4}>
							<StatusBar />
						</Col>
						<Col md={8}>
							<h2>Messages</h2>
							<MessageBox messages={messages} />
							<SearchBar handleSubmit={handleSubmit} />
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}
