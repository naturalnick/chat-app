import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { SocketContext } from "../../context/socket";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import "./Login.css";

export default function Login() {
	const socket = useContext(SocketContext);
	const [isRegistering, setIsRegistering] = useState(false);
	const [error, setError] = useState("");
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

	const onSignIn = (data) => {
		socket.emit("login_register", data);
	};

	return (
		<Container className="Login">
			{authenticated && <Navigate to="/" replace={true} />}
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
							maxLength: 4,
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
