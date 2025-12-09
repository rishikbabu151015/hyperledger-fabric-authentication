'use strict';
/**
 * enrollAdmin.js
 * Enrolls the CA admin and stores identity in wallet
 */

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const ccpPath = path.resolve(__dirname, 'connection-org1.json');
    if (!fs.existsSync(ccpPath)) {
      console.error('connection-org1.json not found. Copy it from fabric-samples/test-network/.../connection-org1.json');
      process.exit(1);
    }
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const adminExists = await wallet.get('admin');
    if (adminExists) {
      console.log('Admin identity already exists in the wallet');
      return;
    }

    // Default test-network admin credentials: admin / adminpw
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes()
      },
      mspId: 'Org1MSP',
      type: 'X.509'
    };

    await wallet.put('admin', x509Identity);
    console.log('Successfully enrolled admin user "admin" and imported into the wallet');
  } catch (error) {
    console.error('Failed to enroll admin:', error);
    process.exit(1);
  }
}

main();
