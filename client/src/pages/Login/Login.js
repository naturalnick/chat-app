import React, { useEffect, useState, useContext, useMemo } from "react";
import { useForm } from "react-hook-form";
import { SocketContext } from "../../context/Socket";

import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./Login.css";

export default function Login({ setToken }) {
	const socket = useContext(SocketContext);
	const [isRegistering, setIsRegistering] = useState(false);
	const [error, setError] = useState("");
	const {
		register,
		handleSubmit,
		setValue,
		setFocus,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		setValue("type", isRegistering ? "register" : "login");
	}, [isRegistering, setValue]);

	const determineError = useMemo(() => {
		return isRegistering
			? "Username already exists."
			: "Username or password is incorrect.";
	}, [isRegistering]);

	useEffect(() => {
		function authenticateUser(usersToken) {
			localStorage.setItem("authentication", usersToken);
			setToken(usersToken);
		}

		setFocus("username", { shouldSelect: true });

		socket.on("authenticate", (data) => {
			localStorage.setItem("authentication", data.jwt);
			authenticateUser(data.jwt);
		});
		socket.on("invalid", () => {
			setError(determineError);
		});
		return () => {
			socket.off("invalid");
		};
	}, [socket, setFocus, setToken, determineError]);

	const onSignIn = (formData) => {
		socket.emit("login_register", formData);
	};

	function displayForm() {
		return (
			<Form>
				<Form.Group className="mb-3">
					<Form.Label>Username</Form.Label>
					<Form.Control
						type="text"
						placeholder="Username"
						{...register("username", {
							required: true,
							minLength: 3,
							maxLength: 20,
						})}
						role="username-input"
					/>
					{errors.username && isRegistering && (
						<Form.Text className="error">
							A username between 4-20 characters is required.
						</Form.Text>
					)}
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Password (four letters or numbers)</Form.Label>
					<Form.Control
						type="password"
						placeholder="Password"
						{...register("password", {
							required: true,
							minLength: 4,
							maxLength: 20,
							// pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
						})}
					/>
					{errors.password && isRegistering && (
						<Form.Text className="error">
							A four character password is required.
						</Form.Text>
					)}
				</Form.Group>
				<div className="d-grid">
					<Button onClick={handleSubmit(onSignIn)} name="submit">
						{isRegistering ? "Sign Up" : "Sign In"}
					</Button>
				</div>
				<div className="member">
					{isRegistering ? "Already a member? " : "Not a member? "}
					<span
						className="switch-login"
						onClick={() => {
							setError("");
							setIsRegistering(
								(prevIsRegistering) => !prevIsRegistering
							);
						}}
					>
						{isRegistering ? "Sign In" : "Register"}
					</span>
				</div>
			</Form>
		);
	}

	return (
		<div className="Login">
			<Stack gap={2} className="mx-auto">
				<h2>Chatroom</h2>
				<h1>{isRegistering ? "Register" : "Sign In"}</h1>
				<div className="error">{error}</div>
				{displayForm()}
			</Stack>
		</div>
	);
}
