const Fift = require('../index');


const fift = new Fift({ usePatchedFift: true });

// Create new wallet and display all info
// fift.createNewWallet({
//   workchainId: '0', walletName: 'new-wallet',
// }).then((res) => {
//   console.info(res.output); // display .fif output
//   console.info(res.files['new-wallet.pk']); // display pk
//   console.info(res.files['new-wallet.addr']); // display address file
//   console.info(res.files['new-wallet-query.boc']); // display boc file
// }).catch((e) => {
//   console.info(e);
// });

// Load Private key from our parameter and display all info
fift.createNewWallet({
  workchainId: '0', walletName: 'new-wallet', privateKey: '3986E77DB85235C426D8DE224B1F095636F414CDF40B954419733E4BF3F3F0BC',
}).then((res) => {
  console.info(res.output); // display .fif output
  console.info(res.files['new-wallet.addr']); // display address file
  console.info(res.files['new-wallet-query.boc']); // display boc file
}).catch((e) => {
  console.info(e);
});
