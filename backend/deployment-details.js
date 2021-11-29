const fs = require("fs");

const details = {
  deploymentAddress: {
    4: ""
  },
  abi: {}
};

const defaultAbi = [];

const developFile = "../ui/src/web3Info/develop-details.json";
const developChainId = 1337;

if (fs.existsSync(developFile)) {
  const developDetails = JSON.parse(String(fs.readFileSync(developFile)));
  details.deploymentAddress[developChainId] = developDetails.contractAddress;
  details.abi[developChainId] = developDetails.abi;
}

Object.keys(details.deploymentAddress).forEach(chainId => {
  if (!details.abi[chainId]) {
    details.abi[chainId] = defaultAbi;
  }
})

module.exports = details;
