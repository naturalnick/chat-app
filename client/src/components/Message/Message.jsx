import "./Message.css";

export default function Message({ message }) {
	return (
		<div key={message.id} className="message">
			<span className="username">{message.username}: </span>
			{message.text}
		</div>
	);
}
