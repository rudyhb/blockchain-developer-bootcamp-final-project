const { ethers } = require("ethers");
const developDetails = require("./deployment-details");

const contracts = {};

const tryGetContract = async (chainId) => {
  if (contracts[chainId])
    return contracts[chainId];

  //TODO: add more providers here
  const provider = new ethers.providers.JsonRpcProvider();

  const network = await provider.detectNetwork();
  const networkChainId = network.chainId;

  if (chainId !== networkChainId)
    throw new Error(`unsupported chainId: ${chainId}`);

  const abi = developDetails.abi[chainId];
  const address = developDetails.deploymentAddress[chainId];

  if (!abi || !address)
    throw new Error(
      `could not find deployment details for the contract at chainId=${chainId}`
    );

  const contract = new ethers.Contract(address, abi, provider);
  contracts[chainId] = contract;
  return contract;
}


module.exports = {
  getRoleFor: async (address, nftId, chainId) => {
    const contract = await tryGetContract(chainId);
    const role = await contract.getRoleFor(address, nftId);
    if (!role)
      throw new Error('token does not specify any role for this address');
    return role;
  },
  recoverAddress: (messageSigned, signature) => {
    return ethers.utils.recoverAddress(messageSigned, signature);
  }
};
