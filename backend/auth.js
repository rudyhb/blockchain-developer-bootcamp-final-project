const rpc = require("./rpc");
const {nanoid} = require('nanoid');

const requests = {};

const makeMessage = (requestId, nftId, chainId) => `requesting sign-in for NFT ${nftId} on chain ${chainId} with request ${requestId}`;

const newRequest = (nftId, chainId) => {
  const requestId = nanoid();
  requests[requestId] = {nftId, chainId};
  return {
    requestId,
    message: makeMessage(requestId, nftId, chainId)
  };
}

const verifySignature = async (requestId, signature) => {
  const request = requests[requestId];
  if (!request)
    throw new Error(`request not found: ${requestId}`);
  const {nftId, chainId} = request;
  const message = makeMessage(requestId, nftId, chainId);
  const address = rpc.recoverAddress(message, signature);
  if (!address)
    throw new Error('could not recover address from signature');
  delete requests[requestId];
  const role = await rpc.getRoleFor(address, nftId, chainId);
  return {
    nftId,
    role,
    address
  };
}

module.exports = {
  newRequest,
  verifySignature
};
