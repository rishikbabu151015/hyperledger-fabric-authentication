#!/usr/bin/env bash
# run-demo.sh
# Automates the Node.js steps after test-network is up.
set -e
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$ROOT_DIR/results"
mkdir -p "$LOG_DIR"

echo "Installing npm packages..."
npm install --no-audit --no-fund > "$LOG_DIR/npm-install.log" 2>&1

echo "Enrolling admin..."
node enrollAdmin.js > "$LOG_DIR/enrollAdmin.log" 2>&1 || (echo "enrollAdmin failed, see log"; exit 1)
echo "Registering user1..."
node registerUser.js user1 user1pw > "$LOG_DIR/registerUser.log" 2>&1 || (echo "registerUser failed, see log"; exit 1)
echo "Running auth test..."
node auth-test-app.js user1 > "$LOG_DIR/authTest.log" 2>&1 || (echo "authTest failed, see log"; exit 1)

echo "Done. Logs available in $LOG_DIR"
