import { useEffect, useRef } from "react";

import Message from "../Message/Message";
import MessageBar from "../MessageBar/MessageBar";

import "./MessageBox.css";

export default function MessageBox({ messages }) {
	const anchorRef = useRef();

	useEffect(() => {
		anchorRef.current.scrollIntoView();
	}, [messages]);

	const messageElements = messages.map((message) => (
		<Message message={message} />
	));
	return (
		<div className="message-container">
			<div className="message-area">
				{messageElements}
				<div className="anchor" ref={anchorRef}></div>
			</div>
			<div className="message-bar">
				<MessageBar />
			</div>
		</div>
	);
}
