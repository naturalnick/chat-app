CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	name text UNIQUE NOT NULL,
	date_created text NOT NULL,
	password text NOT NULL,
	is_online boolean NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
	id SERIAL PRIMARY KEY,
	username text NOT NULL,
	text text NOT NULL,
	date_created text NOT NULL
);