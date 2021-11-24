"use strict";

const express = require("express");
const auth = require('./auth');
const tokenManagement = require('./tokenManagement');
const userData = require('./userData');

const PORT = parseInt(process.env.APP_PORT) || 8081;
const HOST = process.env.APP_HOST || "0.0.0.0";

// App
const app = express();

// Error Handling Helper Function
function asyncHelper(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

//app.use(function (err, req, res, next) {
//  if (!err) return next();
//  console.error(err);
//  res.json({ error: true, message: err.message });
//});
//app.use(express.json());

app.get("/auth", asyncHelper(async (req, res) => {
  const {nftId, chainId} = req.query;

  if (nftId && chainId) {
    const {message, requestId} = auth.newRequest(nftId, chainId);
    return res.json({
      requestId,
      message,
      signatureRequest: true
    });
  }

  const {requestId, signature} = req.query;

  if (requestId && signature)
  {
    const {nftId, role, address} = await auth.verifySignature(requestId, signature);
    const token = await tokenManagement.getNewToken(address, nftId, role);
    return res.json({
      token
    });
  }

  throw new Error("invalid request");
}));

const retrieveDetails = async req => {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  if (!token)
    throw new Error('no token provided');
  const {address, nftId, role} = await tokenManagement.retrieveDetails(token);
  return {
    address,
    nftId,
    role
  };
}

app.get("/userData", asyncHelper(async (req, res) => {
  const {address, nftId, role} = await retrieveDetails(req);
  const status = await userData.getStatusForNftId(nftId);
  return res.json({
    nftId,
    address,
    role,
    status
  });
}))

app.put('/userData', asyncHelper(async (req, res) => {
  const status = req.query.status;
  if (!status)
    throw new Error('no status provided');
  const {address, nftId, role} = await retrieveDetails(req);
  await userData.setStatusForNftId(nftId, status);
  return res.json({
    success: true,
    nftId,
    address,
    role,
    status
  });
}))

app.get('*', (req, res) => {
  throw new Error('404');
});

app.use((error, req, res, next) => {
  console.error(error)
  res.json({
    error: true,
    message: error.message
  });
});


app.listen(PORT, HOST, (err) => {
  if (err) console.error(err);
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
