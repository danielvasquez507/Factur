#!/bin/bash
export SSHPASS=$(grep -oP '(?<=^SERVER_SSH_PASSWORD=").*(?=")' .env)
sshpass -e ssh eliam@192.168.40.10 -o StrictHostKeyChecking=no "curl -I http://localhost:3001/favicon-f.svg"
