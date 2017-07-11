'use strict'
const SPSP = require('ilp').SPSP;
const FiveBellsLedgerPlugin = require('ilp-plugin-bells');

async function send(username,password,amount,receiver,message = ""){
	const plugin = new FiveBellsLedgerPlugin({
	  account: 'https://ilp.tumo.org/ledger/accounts/'+username,
	  password: password
	})


		await plugin.connect();
		console.log('connected');

		var quote = await SPSP.quote(plugin, {
	    receiver: receiver+'@ilp.tumo.org',
	    sourceAmount: amount
	 	 });
		console.log("Ready");

		quote.memo = { message: message };

		return SPSP.sendPayment(plugin, quote);
}

module.exports=send;