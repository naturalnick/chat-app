#!/usr/bin/env bash
# exit on error
set -o errexit

npm i --prefix ./../client
npm run build --prefix ./../client

pip --install --upgrade pip
pip install -r requirements.txt