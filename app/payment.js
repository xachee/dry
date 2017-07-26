'use strict'

const SPSP = require('ilp').SPSP;
const FiveBellsLedgerPlugin = require('ilp-plugin-bells');

async function send(sender, senderPass, amount, receiver, message = "") {
  const plugin = new FiveBellsLedgerPlugin({
    account: 'https://ilp.tumo.org/ledger/accounts/' + sender,
    password: senderPass
  })

  await plugin.connect();
  console.log('connected');

  var quote = await SPSP.quote(plugin, {
    receiver: receiver + '@ilp.tumo.org',
    sourceAmount: amount
  });

  quote.headers = {
    'Source-Identifier': sender + '@ilp.tumo.org',
    'Message': message
  }

  console.log("Payment quote is ready");

  return SPSP.sendPayment(plugin, quote);
}

module.exports = send;