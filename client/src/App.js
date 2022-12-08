import React, { useState } from "react";

import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import "./App.css";

export default function App() {
	const [authenticated, setAuthenticated] = useState(() => {
		if (
			localStorage.getItem("token") != null &&
			localStorage.getItem("token") !== undefined
		) {
			return true;
		} else return false;
	});

	return (
		<div className="App">
			{authenticated ? (
				<Dashboard setAuthenticated={setAuthenticated} />
			) : (
				<Login setAuthenticated={setAuthenticated} />
			)}
		</div>
	);
}
