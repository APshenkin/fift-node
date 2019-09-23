const fiftLib = require('./fiftLib');

class Fift {
  constructor({ fiftLocation, libLocation, usePatchedFift = false }) {
    if (typeof fiftLocation === 'undefined') {
      this.fiftLocation = `${__dirname}/${usePatchedFift ? '/patchedSmartContracts' : '/smartContracts'}`;
      this.libLocation = `${this.fiftLocation}/lib/`;
    } else {
      this.fiftLocation = fiftLocation;
      this.libLocation = libLocation;
    }
  }

  run(file, args, generatedFiles = []) {
    // add first dummy argument
    args.unshift('aba');

    return new Promise((resolve, reject) => {
      fiftLib.run(file, this.libLocation, args, args.length, generatedFiles, generatedFiles.length, (res, err) => {
        if (err == null) {
          res.length = generatedFiles.length + 1;

          const files = {};
          generatedFiles.forEach((el, index) => {
            files[el] = res[index + 1];
          });

          resolve({
            output: res[0],
            files,
          });
        } else {
          reject(err);
        }
      });
    });
  }

  createNewWallet({ workchainId, walletName, privateKey }) {
    if (typeof privateKey === 'undefined') {
      return this.run(`${this.fiftLocation}/new-wallet.fif`, [workchainId, walletName], [`${walletName}.pk`, `${walletName}.addr`, `${walletName}-query.boc`]);
    }
    return this.run(`${this.fiftLocation}/new-wallet-from-pk.fif`, [workchainId, privateKey, walletName], [`${walletName}.addr`, `${walletName}-query.boc`]);
  }
}

module.exports = Fift;
