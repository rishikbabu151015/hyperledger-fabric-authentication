# Hyperledger Fabric — User Registration & Authentication

## Objective
Implement a registration & authentication flow using Fabric CA and a simple Node.js app to verify identity-based ledger access.

## Project structure
```
hyperledger-auth-example/
├─ connection-org1.json           # copy from test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json
├─ wallet/                        # created by scripts (stores identities)
├─ enrollAdmin.js
├─ registerUser.js
├─ auth-test-app.js
├─ express-login-api.js
├─ package.json
├─ run-demo.sh
└─ README.md
```

## Prerequisites
- Docker & Docker Compose
- Node.js >= 16
- git
- fabric-samples (tested with Fabric v2.x / v2.4+)
- Follow Hyperledger Fabric docs to run `./scripts/bootstrap.sh` in `fabric-samples` to fetch binaries & images.

Test network must be started with Certificate Authorities:
```bash
cd fabric-samples/test-network
./network.sh up createChannel -ca
```

## Quick start
1. Copy Org1 connection profile into this project folder:
```bash
cp <fabric-samples>/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json ./connection-org1.json
```

2. Install dependencies:
```bash
npm install
```

3. Enroll admin:
```bash
node enrollAdmin.js
```

4. Register & enroll a user:
```bash
node registerUser.js user1 user1pw
```

5. Run authentication test (ledger query):
```bash
node auth-test-app.js user1
```

6. (Optional) Start Express login API:
```bash
node express-login-api.js
# POST to http://localhost:3000/login with JSON { "certificatePem": "-----BEGIN CERTIFICATE-----..." }
```

## What to include in your submission
- This project folder (zipped)
- `connection-org1.json` (copied from fabric-samples)
- Screenshots/logs of:
  - `./network.sh up createChannel -ca`
  - `node enrollAdmin.js`
  - `node registerUser.js user1 user1pw`
  - `node auth-test-app.js user1`
  - `ls -R wallet/` showing identities

## Design highlights (what makes this standout)
- Uses Fabric CA with attributes set at registration (example: `role=appUser`) for attribute-based access control.
- Demonstrates ledger authentication via `qscc` system chaincode query.
- Includes a simple Express API for certificate-based login (demo-only).
- `run-demo.sh` automates Node steps and captures logs into `results/` for easy reviewer re-run.
- Security notes included in README.

-- End of README
