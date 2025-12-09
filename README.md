Hyperledger Fabric – User Registration & Authentication

A complete demo showcasing how to register, enroll, and authenticate users using Hyperledger Fabric CA.
This project walks through setting up a Fabric test network, issuing identities, storing them in a wallet, and authenticating users by querying the blockchain.

🔥 Objective

Implement a simple user registration + authentication workflow in a Hyperledger Fabric network using Fabric CA.

🧩 Features Implemented

✔ Start Fabric network with CA
✔ Enroll CA admin
✔ Register a new user
✔ Enroll user & generate certificate + key
✔ Store identities in file-based wallet
✔ Authenticate user via Fabric Gateway
✔ Query ledger using user identity
✔ (Bonus) Node.js Login API with Register/Login buttons

🚀 1. Environment Setup
Install prerequisites

Node.js (>=16)

Docker Desktop

Git

cURL

Hyperledger Fabric samples + binaries

Clone Fabric samples:

git clone https://github.com/hyperledger/fabric-samples
cd fabric-samples
curl -sSL https://bit.ly/2ysbOFE | bash -s

🚀 2. Start the Test Network with CA
cd fabric-samples/test-network
./network.sh down
./network.sh up createChannel -ca


This command:

Starts 2 peers

Starts an orderer

Starts Fabric CA

Creates mychannel

🏢 3. Enroll the CA Admin
node enrollAdmin.js


Expected output:

Successfully enrolled admin user "admin" and imported it into the wallet

👤 4. Register & Enroll a New User
node registerUser.js user1 user1pw


Expected output:

Successfully registered user1 with secret: user1pw
Successfully enrolled user user1 and imported into the wallet

🔐 5. Authentication – Query Ledger Using User Identity
node auth-test-app.js user1


Expected output:

Successfully queried ledger using identity: user1
Returned buffer length: 244
Ledger query result (hex snippet): 0a00804c...

📁 6. Wallet Structure

Your wallet folder automatically stores:

wallet/
 ├── admin/
 │   ├── idcerts
 │   └── keystore
 └── user1/
     ├── idcerts
     └── keystore

#####This project demonstrates clear understanding of:

Hyperledger CA

MSP identity creation

Enrollment / registration

Wallet identity management

Ledger authentication

Gateway-based blockchain access

Designed to be clean, modular, and extensible.
