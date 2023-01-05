#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting app setup..."

### CLIENT SETUP
cd client
npm i --prefix
npm run build --prefix

cd ../server
touch .env

### DATABASE SETUP
echo "Enter your PostgreSQL host (default is localhost)":
read host
host=${host:="localhost"}
echo "DB_HOST = $host" >> .env

echo "Enter the port number (default is 5432)":
read port
port=${host:="5432"}
echo "DB_PORT = $port" >> .env

echo "Enter your PostgreSQL database name (default is postgres):"
read name
name=${name:="postgres"}
echo "DB_NAME = $name" >> .env

echo "Enter your PostgreSQL username (default is same as tablename)":
read username
username=${username:=$name}
echo "DB_USERNAME = $username" >> .env

while true; do
	echo "Enter your PostgreSQL password:"
	read password
	test "$password" != "" && break
done
echo "DB_PASSWORD = $password" >> .env

### SERVER VIRTUAL ENVIRONMENT SETUP
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

### LAUNCH SERVER
python main.py