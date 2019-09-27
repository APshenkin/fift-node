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

    assert.equal(res, 'B5EE9C7241040201000000006A00014F89FFF9723474702DA1EF71858EC211715378B4D6F4AB7AF3F1562038A5B6524644C0000004D0A80C01007A427FCE23BC97714E794B354178E09B37D8E39BFDB62E9956A87572C765949FD8FB47280C6A98B400000000000000000000000000000000000047494654F148555B');
  });

  it('should create send gram message using files', async () => {
    const res = await fift.sendGrams({
      filesDir: __dirname,
      filenameBase: 'my_wallet_name',
      // privateKey: '4B8D1BBCB692A02DAD73FE9BD8A58A107CC320031EDA3B79E4C890CB0A38171F',
      // sourceAddress: '3F5879DF600C4D1E2BBCD1AF8B6F17E3A52107F3AC826E071AB6FE1BFDE17FFCFFFFFFFF',
      destAddress: '0f8gBl8-wqN_wM38jE6Pel_Wg7ma0Ri86H-DpvQpX-sRxey6',
      seqNo: '0x9A15',
      amount: '6.666',
    });

    assert.equal(res, 'B5EE9C724104020100000000AA0001CF88010EF039000F0CEAD74ECC3EAF7BFC6C97F50A133497FCA09A92F2E89C6AD74A8807EFD05FA24EBB18EF03DE4983A654BC24E49218D6C9DB131091A5AD9212AA77A57B3C61EAF19A71E43D723774E28CDAA094CC87EEC09A7D161351B1DE5EC528500004D0A81C01007A427F90032F9F6151BFE066FE462747BD2FEB41DCCD688C5E743FC1D37A14AFF588E2A80C6A98B4000000000000000000000000000000000000544553546D4EC2D7');
  });
});