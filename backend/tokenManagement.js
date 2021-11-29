const {nanoid} = require('nanoid');

const tokens = {};

const getNewToken = async (address, nftId, role) => {
  const token = nanoid();
  tokens[token] = {
    address,
    nftId,
    role
  };
  return token;
}

const retrieveDetails = async (token) => {
  if (!tokens[token])
    throw new Error('token not found');
  return tokens[token];
}

module.exports = {
  getNewToken,
  retrieveDetails
};