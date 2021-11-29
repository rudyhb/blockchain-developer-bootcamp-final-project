const {nanoid} = require('nanoid');

const EXPIRY_MS = 2 * 24 * 60 * 60 * 1000;

const tokens = {};

setInterval(() => {
  const expiryTime = Date.now() - EXPIRY_MS;
  Object.keys(tokens).forEach(token => {
    if (tokens[token].time < expiryTime)
    {
      delete tokens[token];
    }
  })
}, 5 * 60 * 1000);

const getNewToken = async (address, nftId, role, chainId) => {
  const token = nanoid();
  tokens[token] = {
    time: Date.now(),
   data: {
    address,
      nftId,
      role,
      chainId
  }}
  return token;
}

const retrieveDetails = async (token) => {
  const data = tokens[token];
  if (!data || !data.data)
    throw new Error('token expired / not found');
  return data.data;
}

module.exports = {
  getNewToken,
  retrieveDetails
};
