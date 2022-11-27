import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import "./Login.css";

const socket = io.connect();

export default function Login() {
	const [isRegistering, setIsRegistering] = useState(false);
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();
	const [authenticated, setAuthenticated] = useState(() => {
		return localStorage.getItem("authentication") ? true : false;
	});

	useEffect(() => {
		setValue("type", isRegistering ? "register" : "login");
	}, [isRegistering]);

	useEffect(() => {
		socket.on("logged_in", (data) => {
			localStorage.setItem("authentication", data.jwt);
			setAuthenticated(true);
		});
		socket.on("invalid", () => {
			console.log("invalid");
		});
		socket.on("error", () => {
			console.log("error");
		});
		return () => {
			socket.off("logged_in");
		};
	}, []);

	const onSignIn = (data) => {
		socket.emit("login_register", data);
	};

	return (
		<Container className="Login">
			{authenticated && <Navigate to="/" replace={true} />}
			<h1>{isRegistering ? "Register" : "Sign In"}</h1>
			<Form>
				<Form.Group className="mb-3">
					<Form.Label>Username</Form.Label>
					<Form.Control
						type="text"
						placeholder="Username"
						{...register("username", {
							required: true,
							minLength: 3,
							maxLength: 40,
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
