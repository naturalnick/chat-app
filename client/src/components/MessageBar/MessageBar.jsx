import { useState, useContext } from "react";
import { SocketContext } from "../../context/Socket";
import { TokenContext } from "../../context/Token";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./MessageBar.css";

export default function MessageBar() {
	const socket = useContext(SocketContext);
	const token = useContext(TokenContext);
	const [input, setInput] = useState("");

	function handleSubmit() {
		if (input !== "") socket.emit("message", { text: input, token: token });
		setInput("");
	}

	function handleKeyDown(e) {
		if (e.key === "Enter") {
			handleSubmit();
		}
	}

	return (
		<InputGroup>
			<Form.Control
				style={{ borderRadius: "0" }}
				placeholder="Message"
				aria-label="Message"
				aria-describedby="message"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
			<Button
				style={{ borderRadius: "0" }}
				onClick={handleSubmit}
				variant="outline-primary"
			>
				Send
			</Button>
		</InputGroup>
	);
}
