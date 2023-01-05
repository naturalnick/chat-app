import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./Login.css";
import { getUserToken } from "../../services/API";

export default function Login({ setAuthenticated }) {
	const [isRegistering, setIsRegistering] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState("");

	const {
		register,
		getValues,
		setFocus,
		formState: { errors, isValid },
	} = useForm();

	useEffect(() => {
		setFocus("username", { shouldSelect: true });
	}, [setFocus, loaded]);

	useEffect(() => {
		const delayTimer = setTimeout(() => {
			setLoaded(true);
		}, 2000);
		return () => clearTimeout(delayTimer);
	}, []);

	async function logInUser() {
		const formType = isRegistering ? "register" : "login";
		const response = await getUserToken(formType, getValues());

		if ("token" in response) {
			authenticateUser(response.token);
		}
		if ("error" in response) {
			setError(response.error);
		}
	}

	function authenticateUser(usersToken) {
		localStorage.setItem("token", usersToken);
		setAuthenticated(true);
	}

	function handleKeyDown(e) {
		if (e.key === "Enter" && isValid) {
			logInUser();
		}
	}

	function displayUsernameError() {
		return (
			errors.username &&
			isRegistering && (
				<Form.Text className="error">
					A username between 4-20 characters is required.
				</Form.Text>
			)
		);
	}

	function displayPasswordError() {
		return (
			errors.password &&
			isRegistering && (
				<Form.Text className="error">
					A four character password is required.
				</Form.Text>
			)
		);
	}

	function displayFormTypeSwitch() {
		return (
			<div className="member">
				{isRegistering ? "Already a member? " : "Not a member? "}
				<span
					className="switch-login"
					onClick={() => {
						setError("");
						setIsRegistering((prevIsRegistering) => !prevIsRegistering);
					}}
				>
					{isRegistering ? "Sign In" : "Register"}
				</span>
			</div>
		);
	}

	return (
		<div className="Login">
			<Stack gap={2} className={loaded ? "mx-auto" : "hidden mx-auto"}>
				<h1 className="signin-title">
					{isRegistering ? "Register" : "Sign In"}
				</h1>
				<div className="error">{error}</div>
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
						{displayUsernameError()}
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="Password"
							{...register("password", {
								required: true,
								// pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
							})}
							onKeyDown={handleKeyDown}
						/>
						{displayPasswordError()}
					</Form.Group>
					<div className="d-grid">
						<Button
							onClick={() => {
								if (isValid) logInUser();
							}}
							name="submit"
						>
							{isRegistering ? "Sign Up" : "Sign In"}
						</Button>
					</div>
					{displayFormTypeSwitch()}
				</Form>
			</Stack>
		</div>
	);
}
