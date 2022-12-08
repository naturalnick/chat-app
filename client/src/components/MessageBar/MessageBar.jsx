import { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./MessageBar.css";

export default function MessageBar({ handleNewMessage }) {
	const [input, setInput] = useState("");

	function handleSubmit() {
		handleNewMessage(input);
		setInput("");
	}

	function handleKeyDown(e) {
		if (e.key === "Enter") handleSubmit();
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
