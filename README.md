# Burble - A Chat App

<br>

_A full-stack chat application, made with a Javascript React front-end and a Python Flask back-end. Users login via api endpoints, and are connected to Socket.IO for bi-directional websocket communication to send and receive messages fluidly._

<br>

See it in action [here](https://burblechat.herokuapp.com). (may experience 15 second load delay)

<br>

Screenshot:<br>
<img src="./client/src/images/screenshot.png" width="85%">

## Details

### Server:

-  Python-based server using Flask
-  Uses Flask-SocketIO for bi-directional communication to and from the client
-  A JSON web token is generated for validated users which is sent to the client. Once logged in, all socket connections are verified by checking this token. This prevents unauthorized logins and maintains a users identity.
-  Connections are made to a PostgreSQL database to store and access user and message data using the psycopg2 module

### Client:

-  Made with Javascript, ReactJS and Bootstrap components
-  Access is granted upon using or creating credentials and receiving a JSON web token
-  A socket connection is made to the server, and socket events are set up in useEffect hook. User and message data is pushed to the client on load or whenever there are changes to the data.

## Skills Developed

-  How to use Socket.IO with Flask as well as in a React application.
-  Unit testing for a Python/Flask app with jest
-  Serving the client from the server
-  Creating and using JSON web tokens for secure connections
-  Learned the basics of SQL programming with a PostgreSQL database
-  How to setup a PostgreSQL database and access it from the server

## Installation Instructions

1. Create a PostgreSQL database and have your username, password and database name ready
2. At the command line in the root directory run "bash install.sh". When it's finished if everything was entered correctly, your server should be online. If you need to modify credentials edit the .env file found in the server directory.
3. Open a new command line and at the root directory run "cd client && npm start". This should launch the client in your browser or navigate to the URL provided in the terminal.

## Author

-  **Nick Schaefer** - _Full-Stack Software Developer_ - [Website](https://www.nschaefer.com/) | [LinkedIn](https://www.linkedin.com/in/nick-n-schaefer)
