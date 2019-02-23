var SmartContract = artifacts.require("../contracts/SmartContract.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(SmartContract, 1000000000, accounts[0]);
};
