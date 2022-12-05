import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";

import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./Login.css";

export default function Login({ setToken }) {
	const [isRegistering, setIsRegistering] = useState(false);
	const [error, setError] = useState("");
	const {
		register,
		handleSubmit,
		setFocus,
		formState: { errors },
	} = useForm();

	const determineError = useMemo(() => {
		return isRegistering
			? "Username already exists."
			: "Username or password is incorrect.";
	}, [isRegistering]);

	useEffect(() => {
		setError(determineError);
	}, [setError, determineError]);

	useEffect(() => {
		setFocus("username", { shouldSelect: true });
	}, [setFocus]);

	const onSubmit = async (formData) => {
		const formType = isRegistering ? "register" : "login";
		const response = await fetch(
			`http://127.0.0.1:5000/api/auth/${formType}`,
			{
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			}
		);
		const data = await response.json();
		//check for failure
		authenticateUser(data.token);
	};

	function authenticateUser(usersToken) {
		localStorage.setItem("authentication", usersToken);
		setToken(usersToken);
	}

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
					<Button onClick={handleSubmit(onSubmit)} name="submit">
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
				<h2>Burble</h2>
				<h1>{isRegistering ? "Register" : "Sign In"}</h1>
				<div className="error">{error}</div>
				{displayForm()}
			</Stack>
		</div>
	);
}
