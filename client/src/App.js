import React, { useState } from "react";
import { SocketContext, socket } from "./context/Socket";
import { TokenContext } from "./context/Token";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import "./App.css";

export default function App() {
	const [token, setToken] = useState(() => {
		return localStorage.getItem("authentication");
	});

	return (
		<SocketContext.Provider value={socket}>
			<TokenContext.Provider value={token}>
				<div className="App">
					{token ? (
						<Dashboard setToken={setToken} />
					) : (
						<Login setToken={setToken} />
					)}
				</div>
			</TokenContext.Provider>
		</SocketContext.Provider>
	);
}
