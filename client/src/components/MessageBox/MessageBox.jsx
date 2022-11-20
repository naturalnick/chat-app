import "./MessageBox.css";

export default function MessageBox({ messages }) {
	const messageElements = messages.map((message) => (
		<p key={message.id}>
			<span>{message.user}: </span>
			{message.text}
		</p>
	));
	return <div className="message-box">{messageElements}</div>;
}
