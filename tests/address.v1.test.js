const assert = require('assert');
const Address = require('../address');

const Fift = require('../index');

const fift = new Fift({ usePatchedFift: true });

describe('address wallet v1', () => {
  it('should parse address from private key', async () => {
    const res = await Address.parseFromWalletPrivateKey({ workchainId: -1, privateKey: '3986E77DB85235C426D8DE224B1F095636F414CDF40B954419733E4BF3F3F0BC', fift });

    assert.equal(res.toFift(), 'E9AB61F13126417B1DFCDC3C2C3DC2A23CDE3850B809428B2F82A8ED6D65799DFFFFFFFF');
  });

  it('should parse address from public key', async () => {
    const res = await Address.parseFromWalletPublicKey({ workchainId: -1, publicKey: 'C9FFBEF20D30674EB53F7BCBA6D84F9A2DCBEFA99DE0C880E53A0983132565C4', fift });

    assert.equal(res.toFift(), 'E9AB61F13126417B1DFCDC3C2C3DC2A23CDE3850B809428B2F82A8ED6D65799DFFFFFFFF');
  });
});
