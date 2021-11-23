"use strict";

const express = require("express");
const auth = require('./auth');
const tokenManagement = require('./tokenManagement');

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

app.get('*', (req, res) => {
  throw new Error('404');
});

app.use((error, req, res, next) => {
  res.json({
    error: true,
    message: error.message
  });
});


app.listen(PORT, HOST, (err) => {
  if (err) console.error(err);
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
