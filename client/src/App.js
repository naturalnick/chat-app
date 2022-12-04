import React, { useState } from "react";
import { TokenContext } from "./context/Token";
import { SocketContext, socket } from "./context/Socket";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import "./App.css";

export default function App() {
	const [token, setToken] = useState(() => {
		return localStorage.getItem("authentication");
	});

	return (
		<TokenContext.Provider value={token}>
			<div className="App">
				{token ? (
					<SocketContext.Provider value={socket}>
						<Dashboard setToken={setToken} />
					</SocketContext.Provider>
				) : (
					<Login setToken={setToken} />
				)}
			</div>
		</TokenContext.Provider>
	);
}
