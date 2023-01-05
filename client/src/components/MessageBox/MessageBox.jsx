import { useEffect, useRef } from "react";
import { sendMessage } from "../../services/API";

import Message from "../Message/Message";
import MessageBar from "../MessageBar/MessageBar";

import "./MessageBox.css";

export default function MessageBox({ token, messages }) {
	const anchorRef = useRef();

	useEffect(() => {
		anchorRef.current.scrollIntoView();
	}, [messages]);

	const messageElements = messages.map((message) => (
		<Message key={message.id} message={message} />
	));

	async function handleNewMessage(input) {
		if (input !== "") await sendMessage(token, input);
	}
	return (
		<div className="message-container">
			<div className="message-area">
				{messageElements}
				<div className="anchor" ref={anchorRef}></div>
			</div>
			<div className="message-bar">
				<MessageBar handleNewMessage={handleNewMessage} />
			</div>
		</div>
	);
}
