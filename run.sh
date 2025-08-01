#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Run the server in the background
echo "Starting server..."
python server/server.py &

# Give the server a second to start
sleep 1

# Run the client in the foreground
echo "Starting client..."
python client/client.py

# When client exits, kill the server process
echo "Shutting down server..."
pkill -f server/server.py
