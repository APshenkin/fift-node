const assert = require('assert');
const Fift = require('../index');

const fift = new Fift({ usePatchedFift: false });

describe('test non patched contracts', () => {
  it('should create wallet without PK', async () => {
    const res = await fift.createNewWallet({
      workchainId: '-1',
    });

    assert.notEqual(res.privateKey, undefined);
    assert.notEqual(res.address, undefined);
    assert.notEqual(res.creatingQuery, undefined);
  });

  it('should create for test giver without address', async () => {
    const res = await fift.receiveTestGrams({
      destAddress: '0f-cR3ku4pzylmqC8cE2b7HHN_tsXTKtUOrljsspP7H2jh5q',
      seqNo: '0x9A15',
      amount: '6.666',
    });

    assert.equal(res, 'B5EE9C7241010201006A00014F89FFF9723474702DA1EF71858EC211715378B4D6F4AB7AF3F1562038A5B6524644C0000004D0A80C01007A427FCE23BC97714E794B354178E09B37D8E39BFDB62E9956A87572C765949FD8FB47280C6A98B400000000000000000000000000000000000047494654F23015F6');
  });

  it('should create send gram message using files', async () => {
    const res = await fift.sendGrams({
      filesDir: __dirname,
      filenameBase: 'my_wallet_name',
      destAddress: '0f8gBl8-wqN_wM38jE6Pel_Wg7ma0Ri86H-DpvQpX-sRxey6',
      seqNo: '0x9A15',
      amount: '6.666',
    });

    assert.ok(res);
  });
});
