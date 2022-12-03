import { useCallback, useContext, useEffect } from "react";
import { TokenContext } from "../../context/Token";
import { SocketContext } from "../../context/Socket";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import UserList from "../../components/UserList/UserList";
import MessageBox from "../../components/MessageBox/MessageBox";
import StatusBar from "../../components/StatusBar/StatusBar";

export default function Dashboard({ setToken }) {
	const socket = useContext(SocketContext);
	const token = useContext(TokenContext);

	const logout = useCallback(() => {
		setToken(null);
		localStorage.removeItem("authentication");
		socket.emit("logged_out");
	}, [setToken, socket]);

	useEffect(() => {
		socket.emit("logged_in", token);

		socket.on("request_denied", () => {
			logout();
		});

		return () => {
			socket.off("request_denied");
		};
	}, [logout, socket, token]);

	return (
		<Container>
			<StatusBar logout={logout} />
			<Row className="g-0">
				<Col md={9}>
					<MessageBox />
				</Col>
				<Col md={3}>
					<UserList />
				</Col>
			</Row>
		</Container>
	);
}
