'use strict';
/**
 * express-login-api.js
 * Minimal demo of a certificate-based login endpoint.
 * It checks whether a submitted PEM certificate exists in the filesystem wallet.
 *
 * Note: This is a demo. Real production systems should use mTLS or challenge-response flows.
 */

const express = require('express');
const bodyParser = require('body-parser');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json({ limit: '2mb' }));

const walletPath = path.join(__dirname, 'wallet');

app.post('/login', async (req, res) => {
  const { certificatePem } = req.body;
  if (!certificatePem) return res.status(400).json({ error: 'certificatePem required' });

  try {
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const list = await wallet.list();
    for (const entry of list) {
      const identity = await wallet.get(entry.label);
      if (identity && identity.credentials && identity.credentials.certificate) {
        if (identity.credentials.certificate.trim() === certificatePem.trim()) {
          return res.json({ success: true, username: entry.label });
        }
      }
    }
    return res.status(401).json({ success: false, message: 'Certificate not found in wallet' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.listen(3000, () => {
  console.log('Express login API listening on port 3000');
  console.log('POST /login with JSON body: { "certificatePem": "-----BEGIN CERTIFICATE-----..." }');
});
