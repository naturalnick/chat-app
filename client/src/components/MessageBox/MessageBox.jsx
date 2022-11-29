import { useState, useEffect, useContext, useRef } from "react";
import { SocketContext } from "../../context/socket";
import Message from "../Message/Message";
import "./MessageBox.css";

export default function MessageBox({ token }) {
	const [messages, setMessages] = useState([]);
	const socket = useContext(SocketContext);
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
		<div className="message-box">
			{messageElements}
			<div className="anchor" ref={anchorRef}></div>
		</div>
	);
}
