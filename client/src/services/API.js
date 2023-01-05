import axios from "axios";

export async function getUserToken(formType, userData) {
	const response = await axios
		.post(`/api/auth/${formType}`, userData)
		.catch((error) => {
			if (error.message === "Network Error") {
				return { error: "Server connection failed." };
			} else {
				return { error: error.response.data };
			}
		});
	return response.status === 200 ? response.data : response;
}

export async function getMessages(token) {
	const response = await axios
		.get("/api/messages", {
			headers: { Authorization: token },
		})
		.catch((error) => {
			if (error.message === "Network Error") {
				return { error: "Server connection failed." };
			} else {
				return { error: error.response.data };
			}
		});
	return response.status === 200 ? response.data : response;
}

export async function getUsers(token) {
	const response = await axios
		.get("/api/users", {
			headers: { Authorization: token },
		})
		.catch((error) => {
			if (error.message === "Network Error") {
				return { error: "Server connection failed." };
			} else {
				return { error: error.response.data };
			}
		});
	return response.status === 200 ? response.data : response;
}

export async function sendMessage(token, message) {
	const response = await axios
		.post(
			"/api/message",
			{ message: message },
			{
				headers: { Authorization: token },
			}
		)
		.catch((error) => {
			if (error.message === "Network Error") {
				return { error: "Server connection failed." };
			} else {
				return { error: error.response.data };
			}
		});
	return response.status === 200 ? response.data : response;
}

export async function logoutUser(token) {
	await axios
		.get("/api/auth/logout", {
			headers: { Authorization: token },
		})
		.catch((error) => {
			console.log(error);
		});
}
