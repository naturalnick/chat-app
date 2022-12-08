import React, { useState } from "react";

import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import "./App.css";

export default function App() {
	const [authenticated, setAuthenticated] = useState(() => {
		return localStorage.getItem("authentication") != null ? true : false;
	});

	return (
		<div className="App">
			{authenticated ? (
				<Dashboard setToken={setAuthenticated} />
			) : (
				<Login setToken={setAuthenticated} />
			)}
		</div>
	);
}
