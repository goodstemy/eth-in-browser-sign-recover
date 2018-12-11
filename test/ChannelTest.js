const Channel = artifacts.require('./Channel.sol');
const utils = require('./utils.js');

contract('Channel', accounts => {
  let
    ch,
    currentTime,
    sender = accounts[0],
    recipient = accounts[1],
    deposit = web3.toWei('10', 'ether'),
    signatures = [];

  describe('valid contract creation', () => {
    before(async () => {
      currentTime = Math.floor(new Date().getTime() / 1000);
      ch = await Channel.new(recipient, 60, { from: sender, value: deposit });
    });

    it('sets the correct sender', async () => {
      assert(sender === await ch.sender.call());
    });

    it('sets the correct recipient', async () => {
      assert(recipient === await ch.recipient.call());
    });

    it('sets the correct expiration', async () => {
      assert((currentTime + 60) === (await ch.expiration.call()).toNumber());
    });

    it('sets the correct balance', async () => {
      assert(+deposit === web3.eth.getBalance(ch.address).toNumber());
    });
  });

  describe('payment test', () => {
    before(async () => {
      currentTime = Math.floor(new Date().getTime() / 1000);
      ch = await Channel.new(recipient, 60, { from: sender, value: deposit });
    });

    it('create payments and close channel', async () => {
      let payment = 1;

      for (let i = 0; i < 3; i++) {
        if (i === 1) payment += 4;
        if (i === 2) payment += 5;
        // 1 tx sign 1 ether
        // 2 tx sign 4 ether
        // 3 tx sign 5 ether
        // Total 10 ether to send

        let message = await utils.constructPaymentMessage(ch.address, web3.toWei(payment, 'ether'));
        let signature = await utils.signMessage(web3, message, sender);
        signatures.push(signature);
      }

      let senderBalance = web3.eth.getBalance(sender).toNumber();
      let recipientBalance = web3.eth.getBalance(recipient).toNumber();
      console.log(`Before closing channel balances: `);
      console.log(senderBalance, recipientBalance);

      await ch.closeChannel(web3.toWei(payment, 'ether'), signatures[signatures.length - 1], { from: recipient });

      console.log(`After closing channel balances: `);
      console.log(web3.eth.getBalance(sender).toNumber(), web3.eth.getBalance(recipient).toNumber());

      // TODO: asserts
      // assert(senderBalance - parseInt(web3.toWei('1', 'ether')) - 8e15 < web3.eth.getBalance(sender).toNumber());
      // assert(recipientBalance + parseInt(web3.toWei('1', 'ether')) - 8e15 < web3.eth.getBalance(recipient).toNumber());
    })
  });
});
