import { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function SearchBar({ handleSubmit }) {
	const [input, setInput] = useState("");
	function handleChange(e) {
		setInput(e.target.value);
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
			<Button onClick={() => handleSubmit(input)} variant="primary">
				Send
			</Button>
		</InputGroup>
	);
}
