#!/bin/bash

while true; do
    npm run start:prod
    echo "Server crashed. Restarting in 5 seconds..."
    sleep 5
done
