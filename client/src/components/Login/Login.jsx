import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import "./Login.css";
import Button from "react-bootstrap/esm/Button";
import { useEffect } from "react";

export default function Login() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [authenticated, setAuthenticated] = useState(
		localStorage.getItem(localStorage.getItem("authenticated") || false)
	);

	const onSignIn = (data) => {
		fetch("http://127.0.0.1:5000/api/auth/signin", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setAuthenticated(true);
				localStorage.setItem("authenticated", true);
				navigate("/");
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	};

	const onSignUp = (data) => {
		fetch("http://127.0.0.1:5000/api/auth/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				navigate("/");
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	};
	return (
		<Container className="Login">
			<h1>Sign In</h1>
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
					<Form.Label>Email address</Form.Label>
					<Form.Control
						type="email"
						placeholder="name@example.com"
						{...register("email", {
							required: true,
							pattern:
								/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
						})}
					/>
					{errors.email && (
						<Form.Text className="warning">
							Email address not valid.
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
				<Button onClick={handleSubmit(onSignIn)}>Sign In</Button> OR
				<Button onClick={handleSubmit(onSignUp)}>Sign Up</Button>
			</Form>
		</Container>
	);
}
