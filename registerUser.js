'use strict';
/**
 * registerUser.js
 * Registers a new user with the CA (via admin identity) and enrolls them into the wallet.
 *
 * Usage:
 *   node registerUser.js <username> <password>
 *
 */

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function main() {
  const username = process.argv[2] || 'user1';
  const userSecret = process.argv[3] || 'user1pw';

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

    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
      console.error('Admin identity not found in the wallet. Run enrollAdmin.js first');
      process.exit(1);
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    // Register user with attributes for potential RBAC
    const registrationRequest = {
      enrollmentID: username,
      enrollmentSecret: userSecret,
      role: 'client',
      attrs: [
        { name: 'hf.Registrar.Roles', value: 'client', ecert: true },
        { name: 'role', value: 'appUser', ecert: true }
      ]
    };

    try {
      const secret = await ca.register(registrationRequest, adminUser);
      console.log(`Successfully registered ${username} with secret: ${secret}`);
    } catch (err) {
      // Could already be registered depending on CA state; continue to enroll if secret supplied
      console.warn('Warning during registration (may already be registered):', err.toString());
    }

    // Enroll the user to obtain cert and key
    const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: userSecret });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes()
      },
      mspId: 'Org1MSP',
      type: 'X.509'
    };

    await wallet.put(username, x509Identity);
    console.log(`Successfully enrolled user ${username} and imported into the wallet`);
  } catch (error) {
    console.error('Error registering/enrolling user:', error);
    process.exit(1);
  }
}

main();
