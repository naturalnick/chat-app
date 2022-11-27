import { useState, useContext } from "react";
import { SocketContext } from "../../context/socket";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function SearchBar({ token }) {
	const socket = useContext(SocketContext);
	const [input, setInput] = useState("");
	function handleChange(e) {
		setInput(e.target.value);
	}

	function handleSubmit() {
		// setMessages((prevMessages) => [
		// 	...prevMessages,
		// 	{ id: 345634634, user: "Nick", text: message },
		// ]);
		socket.emit("message", { text: input, token: token });
	}
	return (
		<InputGroup className="">
			<Form.Control
				placeholder="Message"
				aria-label="Message"
				aria-describedby="message"
				value={input}
				onChange={handleChange}
			/>
			<Button onClick={handleSubmit} variant="primary">
				Send
			</Button>
		</InputGroup>
	);
}
