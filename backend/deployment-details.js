const fs = require("fs");

const details = {
  deploymentAddress: {},
  abi: {}
};

const developFile = "../ui/src/web3Info/develop-details.json";
const developChainId = 1337;

if (fs.existsSync(developFile)) {
  const developDetails = JSON.parse(fs.readFileSync(developFile));
  details.deploymentAddress[developChainId] = developDetails.contractAddress;
  details.abi[developChainId] = developDetails.abi;
}

module.exports = details;
