import { useState } from "react";
import "./Message.css";

export default function Message({ message }) {
	const [timeShown, setTimeShown] = useState(false);
	const messageDate = formatDate(message.date_created).split(", ").join(" ");

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
			<span className="username">
				<img
					alt=""
					src={require("../../images/more.png")}
					width="15"
					height="15"
					onClick={() => {
						setTimeShown((prevTimeShown) => !prevTimeShown);
					}}
				/>{" "}
				{message.username}:
			</span>
			{timeShown ? <span className="date">{messageDate} </span> : ""}
			{message.text}
		</div>
	);
}
