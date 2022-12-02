import { useContext, useEffect } from "react";
import { TokenContext } from "../../context/Token";
import { SocketContext } from "../../context/Socket";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import UserList from "../../components/UserList/UserList";
import MessageBox from "../../components/MessageBox/MessageBox";
import StatusBar from "../../components/StatusBar/StatusBar";

export default function Dashboard({ revokeAccess }) {
	const socket = useContext(SocketContext);
	const token = useContext(TokenContext);

	useEffect(() => {
		socket.emit("logged_in", token);

		socket.on("request_denied", () => {
			revokeAccess();
		});

		return () => {
			socket.off("request_denied");
		};
	}, []);

	function handleLogout() {
		socket.emit("logged_out");
		revokeAccess();
	}

	return (
		<Container>
			<StatusBar handleLogout={handleLogout} />
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
