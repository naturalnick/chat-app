import { useState } from "react";
import "./Message.css";

export default function Message({ message }) {
	const [timeShown, setTimeShown] = useState(false);
	const messageDate = message.date_created.split(" ");

	function changeTimeZone(date) {
		const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		return new Date(
			new Date(date).toLocaleString("en-US", {
				timeZone,
			})
		);
	}

	//console.log(message.date_created);
	return (
		<div key={message.id} className="message">
			<span
				className="date"
				onMouseEnter={() => setTimeShown(true)}
				onMouseLeave={() => setTimeShown(false)}
			>
				{messageDate[0]}{" "}
			</span>
			{timeShown ? <span className="time">{messageDate[1]} </span> : ""}
			<span className="username">{message.username}: </span>
			{message.text}
		</div>
	);
}
