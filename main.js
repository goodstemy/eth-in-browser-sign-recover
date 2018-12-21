import vynos from 'vynos';
const Web3 = require('web3');

let s = '';

const myData = {
	name: 'Ivan',
	amount: 0
};

vynos.ready().then(wallet => {
	vynos.display().then(() => {
		const button = document.getElementById('button');
		const recoverButton = document.getElementById('recover');
		const web3 = new Web3(wallet.provider);

		web3.eth.getAccounts((err, accounts) => {
			if (err) {
				throw err;
			}

			const account = accounts[0];

			button.addEventListener('click', (e) => {
				e.preventDefault();

				signData(web3, account);
			});

			recoverButton.addEventListener('click', (e) => {
				e.preventDefault();

				recover(web3, account);
			});
		});
	});
})

function signData(web3, account) {
	web3.eth.sign(JSON.stringify(myData), account).then((signature) => {
		alert(`signature: ${signature}`);
		s = signature;
	});
}

function recover(web3, account) {
	web3.eth.personal.ecRecover(JSON.stringify(myData), s).then((address) => {
		alert(`signed by ${address}`);
	});
}