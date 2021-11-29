const deploymentDetails = require('./deployment-details');
const chains = Object.keys(deploymentDetails.deploymentAddress);
const data = {};
chains.forEach(chain => {
  data[chain] = {};
})

const getStatusForNftId = async (id, chainId) => {
  if (!data[chainId])
    throw new Error('chain id not found: ' + chainId);
  return data[chainId][id] || "";
}

const setStatusForNftId = async (id, status, chainId) => {
  if (!data[chainId])
    throw new Error('chain id not found: ' + chainId);
  if (status.length > 300)
    throw new Error('status is too long');
  data[chainId][id] = status;
}

module.exports = {
  getStatusForNftId,
  setStatusForNftId
};
