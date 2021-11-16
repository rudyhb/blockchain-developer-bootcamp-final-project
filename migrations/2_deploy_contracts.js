var NftId = artifacts.require("./NftId.sol");

module.exports = function(deployer) {
  deployer.deploy(NftId);
};

