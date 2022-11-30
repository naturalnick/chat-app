import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { SocketContext } from "../../context/Socket";

import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";

import "./Login.css";

export default function Login({ authenticateUser }) {
	const socket = useContext(SocketContext);
	const [isRegistering, setIsRegistering] = useState(false);
	const [error, setError] = useState("");
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		setValue("type", isRegistering ? "register" : "login");
	}, [isRegistering]);

	useEffect(() => {
		socket.on("athenticate", (data) => {
			localStorage.setItem("authentication", data.jwt);
			authenticateUser(data.jwt);
		});
		socket.on("invalid", () => {
			setError(
				isRegistering
					? "Username already exists."
					: "Username or password is incorrect."
			);
		});
		socket.on("error", () => {
			console.log("error");
		});
		return () => {
			socket.off("logged_in");
			socket.off("invalid");
			socket.off("error");
		};
	}, []);

	const onSignIn = (formData) => {
		socket.emit("login_register", formData);
	};

	return (
		<Container className="Login">
			<h1>{isRegistering ? "Register" : "Sign In"}</h1>
			<p className="error">{error}</p>
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
					/>
					{errors.username && (
						<Form.Text className="warning">
							Username is required and must be between 4-40 alpha-numeric
							characters.
						</Form.Text>
					)}
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Password</Form.Label>
					<Form.Control
						type="password"
						placeholder="Password"
						{...register("password", {
							required: true,
							minLength: 3,
							maxLength: 5,
							// pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
						})}
					/>
					{errors.password && (
						<Form.Text className="warning">Password not valid.</Form.Text>
					)}
				</Form.Group>
				<Button onClick={handleSubmit(onSignIn)}>
					{isRegistering ? "Sign Up" : "Sign In"}
				</Button>
				<p className="p-login">
					{isRegistering ? "Already a member? " : "Not a member? "}
					<span
						className="switch-login"
						onClick={() => {
							setIsRegistering(
								(prevIsRegistering) => !prevIsRegistering
							);
						}}
					>
						{isRegistering ? "Sign In" : "Register"}
					</span>
				</p>
			</Form>
		</Container>
	);
}
