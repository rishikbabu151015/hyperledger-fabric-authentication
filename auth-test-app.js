'use strict';
/**
 * auth-test-app.js
 * Loads a user identity from the wallet, connects to gateway and queries ledger (qscc) to verify authentication.
 *
 * Usage:
 *   node auth-test-app.js <username>
 */

const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
  const username = process.argv[2] || 'user1';
  try {
    const ccpPath = path.resolve(__dirname, 'connection-org1.json');
    if (!fs.existsSync(ccpPath)) {
      console.error('connection-org1.json not found. Copy it from fabric-samples/test-network/.../connection-org1.json');
      process.exit(1);
    }
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get(username);
    if (!identity) {
      console.error(`An identity for the user "${username}" does not exist in the wallet. Run registerUser.js first.`);
      process.exit(1);
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

    const network = await gateway.getNetwork('mychannel');

    // Query system chaincode qscc to fetch chain info for proof-of-access
    const contract = network.getContract('qscc');
    const result = await contract.evaluateTransaction('GetChainInfo', 'mychannel');

    console.log('Successfully queried ledger using identity:', username);
    console.log('Result length (bytes):', result.length);
    console.log('Result (hex preview):', result.toString('hex').slice(0, 240));

    await gateway.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Failed to run authentication test:', error);
    process.exit(1);
  }
}

main();
