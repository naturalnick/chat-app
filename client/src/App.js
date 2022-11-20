import { useState } from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./App.css";
import SearchBar from "./components/SearchBar/SearchBar";
import StatusBar from "./components/StatusBar/StatusBar";
import MessageBox from "./components/MessageBox/MessageBox";

export default function App() {
	const users = [
		{
			name: "Nick",
			isOnline: true,
		},
		{
			name: "Rob",
			isOnline: true,
		},
	];

	const [messages, setMessages] = useState([
		{
			id: 782937492837,
			user: "Nick",
			text: "Hello World",
		},
		{
			id: 384572390,
			user: "Nick",
			text: "Second Message",
		},
		{
			id: 234872390874,
			user: "Rob",
			text: "I like to play video games.",
		},
		{
			id: 347834535,
			user: "Rob",
			text: "This is a second Message",
		},
	]);

	function handleSubmit(message) {
		setMessages((prevMessages) => [
			...prevMessages,
			{ id: 345634634, user: "Nick", text: message },
		]);
	}

	console.log(messages);

	return (
		<div className="App">
			<Container>
				<Row>
					<Col md={4}>
						<StatusBar users={users} />
					</Col>
					<Col md={8}>
						<h2>Messages</h2>
						<MessageBox users={users} messages={messages} />
						<SearchBar handleSubmit={handleSubmit} />
					</Col>
				</Row>
			</Container>
		</div>
	);
}
