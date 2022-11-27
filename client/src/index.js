import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketContext, socket } from "./context/socket";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import Login from "./components/Login/Login";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<SocketContext.Provider value={socket}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="login" element={<Login />} />
					{/* <Route path="*" element={<Error />} /> */}
				</Routes>
			</BrowserRouter>
		</SocketContext.Provider>
	</React.StrictMode>
);
