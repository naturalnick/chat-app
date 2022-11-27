import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../../context/socket";
import "./MessageBox.css";

export default function MessageBox({ token }) {
	const [messages, setMessages] = useState([]);
	const socket = useContext(SocketContext);
	useEffect(() => {
		socket.on("messages", (messages) => {
			console.log(messages);
			setMessages(messages);
		});
		socket.emit("retrieve_messages", token);
	}, []);

	const messageElements = messages.map((message) => (
		<p key={message.id}>
			<span>{message.username}: </span>
			{message.text}
		</p>
	));
	return <div className="message-box">{messageElements}</div>;
}
