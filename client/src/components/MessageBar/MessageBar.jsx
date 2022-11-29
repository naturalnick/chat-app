import { useState, useContext } from "react";
import { SocketContext } from "../../context/socket";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function MessageBar({ token }) {
	const socket = useContext(SocketContext);
	const [input, setInput] = useState("");

	function handleSubmit() {
		socket.emit("message", { text: input, token: token });
		setInput("");
	}
	return (
		<InputGroup className="">
			<Form.Control
				placeholder="Message"
				aria-label="Message"
				aria-describedby="message"
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>
			<Button onClick={handleSubmit} variant="primary">
				Send
			</Button>
		</InputGroup>
	);
}
