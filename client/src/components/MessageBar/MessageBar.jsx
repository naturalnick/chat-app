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
		socket.emit("message", { text: input, token: token });
		setInput("");
	}
	return (
		<div className="message-bar">
			<InputGroup>
				<Form.Control
					style={{ borderRadius: "0" }}
					placeholder="Message"
					aria-label="Message"
					aria-describedby="message"
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
				<Button
					style={{ borderRadius: "0" }}
					onClick={handleSubmit}
					variant="outline-primary"
				>
					Send
				</Button>
			</InputGroup>
		</div>
	);
}
