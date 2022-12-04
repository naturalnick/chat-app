import { useState } from "react";
import "./Message.css";

export default function Message({ message }) {
	const [timeShown, setTimeShown] = useState(false);
	const messageDate = formatDate(message.date_created).split(", ");

	function formatDate(date) {
		const newDate = new Date(date); //auto sets times to local timezone
		return newDate.toLocaleString("en-US", {
			hour12: "true",
			dateStyle: "short",
			timeStyle: "short",
		});
	}

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