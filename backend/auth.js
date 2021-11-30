const rpc = require("./rpc");
const {nanoid} = require('nanoid');

const requests = {};

const makeMessage = (requestId, nftId, chainId) => {
  chainId = parseInt(chainId);
  return {
    domain: {
      // Defining the chain aka Rinkeby testnet or Ethereum Main Net
      chainId,
      // Give a user friendly name to the specific contract you are signing for.
      name: 'NFT ID',
      // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
      // verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      // Just let's you know the latest version. Definitely make sure the field name is correct.
      version: '1',
    },

    // Defining the message signing data content.
    message: {
      /*
       - Anything you want. Just a JSON Blob that encodes the data you want to send
       - No required fields
       - This is DApp Specific
       - Be as explicit as possible when building out the message schema.
      */
      nftId,
      chainId,
      requestId,
      action: 'Sign In',
    },
    // Refers to the keys of the *types* object below.
    primaryType: 'SignIn',
    types: {
      // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        // { name: 'verifyingContract', type: 'address' },
      ],
      SignIn: [
        { name: 'nftId', type: 'uint256' },
        { name: 'requestId', type: 'string' },
        { name: 'action', type: 'string' },
      ],
    },
  };
}

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
    address,
    chainId
  };
}

module.exports = {
  newRequest,
  verifySignature
};
