import { useContext, useEffect } from "react";
import { TokenContext } from "../../context/Token";
import { SocketContext } from "../../context/Socket";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import MessageBar from "../../components/MessageBar/MessageBar";
import StatusBar from "../../components/StatusBar/StatusBar";
import MessageBox from "../../components/MessageBox/MessageBox";

export default function Dashboard({ revokeAccess }) {
	const socket = useContext(SocketContext);
	const token = useContext(TokenContext);
	// const [isLogginIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		socket.emit("logged_in", token);

		socket.on("request_denied", () => {
			revokeAccess();
		});

		socket.on("disconnected", () => {
			token.emit("logged_out", token);
		});

		return () => {
			socket.off("request_denied");
			socket.off("disconnect");
		};
	}, []);

	return (
		<Container>
			<Row>
				<Col md={9}>
					<h2>Messages</h2>
					<MessageBox token={token} />
					<MessageBar token={token} />
				</Col>
				<Col md={3}>
					<StatusBar token={token} />
				</Col>
			</Row>
		</Container>
	);
}
