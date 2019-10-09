const fiftLib = require('./fiftLib');
const Address = require('./address');

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

  run({
    file, args, additionalFiles = [], generatedFiles = [],
  }) {
    // add first dummy argument
    args.unshift('aba');

    return new Promise((resolve, reject) => {
      fiftLib.run(file, this.libLocation, args, args.length, additionalFiles,
        additionalFiles.length, generatedFiles, generatedFiles.length, (res, err) => {
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

  createNewWallet({ workchainId, privateKey }) {
    let promise;
    if (typeof privateKey === 'undefined') {
      promise = this.run({
        file: `${this.fiftLocation}/new-wallet-v2.fif`,
        args: [workchainId],
        generatedFiles: ['new-wallet.pk', 'new-wallet.addr', 'new-wallet-query.boc'],
      });
    } else {
      promise = this.run({
        file: `${this.fiftLocation}/new-wallet-v2-from-pk.fif`,
        args: [workchainId, privateKey, 'new-wallet'],
        generatedFiles: ['new-wallet.addr', 'new-wallet-query.boc'],
      });
    }

    return promise.then(res => ({
      privateKey: privateKey || res.files['new-wallet.pk'],
      address: Address.parseFromFift(res.files['new-wallet.addr']),
      creatingQuery: res.files['new-wallet-query.boc'],
    }));
  }

  getWalletAddress({ workchainId, publicKey }) {
    return this.run({
      file: `${this.fiftLocation}/wallet-address-from-pub-v2.fif`,
      args: [workchainId, publicKey, 'new-wallet'],
      generatedFiles: ['new-wallet.addr'],
    }).then(res => Address.parseFromFift(res.files['new-wallet.addr']));
  }

  receiveTestGrams({
    destAddress, seqNo, amount = '6.666', testGiverAddress,
  }) {
    let promise;
    if (typeof testGiverAddress === 'undefined') {
      promise = this.run({
        file: `${this.fiftLocation}/testgiver.fif`,
        args: [destAddress, seqNo, amount],
        generatedFiles: ['testgiver-query.boc'],
      });
    } else {
      promise = this.run({
        file: `${this.fiftLocation}/testgiver-from-hex.fif`,
        args: [testGiverAddress, destAddress, seqNo, amount],
        generatedFiles: ['testgiver-query.boc'],
      });
    }

    return promise.then(res => res.files['testgiver-query.boc']);
  }

  sendGrams({
    filenameBase, filesDir, destAddress, seqNo, amount, privateKey, workchainId, message = '',
  }) {
    let promise;
    if (typeof privateKey === 'undefined') {
      promise = this.run({
        file: `${this.fiftLocation}/wallet-v2.fif`,
        args: [`${filesDir}/${filenameBase}`, destAddress, seqNo, amount],
        additionalFiles: [
          `${filesDir}/${filenameBase}.addr`,
          `${filesDir}/${filenameBase}.pk`,
        ],
        generatedFiles: ['wallet-query.boc'],
      });
    } else {
      promise = Address.parseFromWalletPrivateKey({ privateKey, workchainId, fift: this }).then(sourceAddress => this.run({
        file: `${this.fiftLocation}/wallet-v2-from-pk.fif`,
        args: [privateKey, sourceAddress.toFift(), destAddress, seqNo, amount, '-C', message],
        generatedFiles: ['wallet-query.boc'],
      }));
    }

    return promise.then(res => res.files['wallet-query.boc']);
  }
}

module.exports = Fift;
