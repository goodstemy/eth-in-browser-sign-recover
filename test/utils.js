const abi = require('ethereumjs-abi');
const BN = require('bn.js');

async function constructPaymentMessage(contractAddress, balance) {
  return abi.soliditySHA3(
    ["address", "uint256"],
    [new BN(contractAddress, 16), balance]
  );
}

async function signMessage(web3, message, accountAddress) {
  return await web3.eth.sign(
    accountAddress,
    `0x${message.toString("hex")}`
  );
}

module.exports = {
  constructPaymentMessage,
  signMessage
};
