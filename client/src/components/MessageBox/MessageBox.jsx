import { useState, useEffect, useContext, useRef } from "react";
import { SocketContext } from "../../context/Socket";
import { TokenContext } from "../../context/Token";
import Message from "../Message/Message";
import MessageBar from "../MessageBar/MessageBar";

import "./MessageBox.css";

export default function MessageBox() {
	const socket = useContext(SocketContext);
	const token = useContext(TokenContext);

	const [messages, setMessages] = useState([]);
	const anchorRef = useRef();

	useEffect(() => {
		socket.on("messages", (messages) => {
			setMessages(messages);
		});
		socket.emit("retrieve_messages", token);
	}, []);

	useEffect(() => {
		anchorRef.current.scrollIntoView();
	}, [messages]);

	const messageElements = messages.map((message) => (
		<Message message={message} />
	));
	return (
		<div>
			<div className="message-box">
				{messageElements}
				<div className="anchor" ref={anchorRef}></div>
			</div>
			<MessageBar />
		</div>
	);
}
