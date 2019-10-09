const assert = require('assert');
const Fift = require('../index');

const fift = new Fift({ usePatchedFift: true });

describe('test patched contracts', () => {
  it('should create wallet from pk', async () => {
    const res = await fift.createNewWallet({
      workchainId: '-1', privateKey: '3986E77DB85235C426D8DE224B1F095636F414CDF40B954419733E4BF3F3F0BC',
    });

    assert.equal(res.privateKey, '3986E77DB85235C426D8DE224B1F095636F414CDF40B954419733E4BF3F3F0BC');
    assert.equal(res.address.workchainId, -1);
    assert.equal(res.address.account.toString('hex'), '472c8515f7f841da3b3c18214c0fab392a900497333a2dbd2528cec741558ada');
    assert.equal(res.creatingQuery, 'B5EE9C724101030100ED0002D789FE8E590A2BEFF083B476783042981F56725520092E66745B7A4A519D8E82AB15B4119D7CB36CD52E33000AB738B01AC3D71BA8C5ECA15DB322461345B01FBF6B11E4C3FDFD550CF5BA5A255DA0B618410CBC1C0B5FE8AA3D888BD104CE410D37A9E0800000001FFFFFFFF0010200AAFF0020DD2082014C97BA9730ED44D0D70B1FE0A4F2608308D71820D31FD31F01F823BBF263ED44D0D31FD3FFD15131BAF2A103F901541042F910F2A2F800029320D74A96D307D402FB00E8D1A4C8CB1FCBFFC9ED54004800000000C9FFBEF20D30674EB53F7BCBA6D84F9A2DCBEFA99DE0C880E53A0983132565C43E7D6539');
  });

  it('should create wallet address from public key', async () => {
    const res = await fift.getWalletAddress({
      workchainId: '-1', publicKey: 'C9FFBEF20D30674EB53F7BCBA6D84F9A2DCBEFA99DE0C880E53A0983132565C4',
    });

    assert.equal(res.workchainId, -1);
    assert.equal(res.account.toString('hex'), '472c8515f7f841da3b3c18214c0fab392a900497333a2dbd2528cec741558ada');
  });

  it('should create wallet without PK', async () => {
    const res = await fift.createNewWallet({
      workchainId: '-1',
    });

    assert.notEqual(res.privateKey, undefined);
    assert.notEqual(res.address, undefined);
    assert.notEqual(res.creatingQuery, undefined);
  });

  it('should equal wallet without PK and from PK', async () => {
    const ethalon = await fift.createNewWallet({
      workchainId: '-1',
    });

    const patched = await fift.createNewWallet({
      workchainId: '-1', privateKey: ethalon.privateKey,
    });

    assert.equal(ethalon.creatingQuery, patched.creatingQuery);
    assert.deepEqual(ethalon.address, patched.address);
  });

  it('should create message for test giver', async () => {
    const res = await fift.receiveTestGrams({
      testGiverAddress: 'FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260FFFFFFFF',
      destAddress: '0f-cR3ku4pzylmqC8cE2b7HHN_tsXTKtUOrljsspP7H2jh5q',
      seqNo: '0x9A15',
      amount: '6.666',
    });

    assert.equal(res, 'B5EE9C7241010201006A00014F89FFF9723474702DA1EF71858EC211715378B4D6F4AB7AF3F1562038A5B6524644C0000004D0A80C01007A427FCE23BC97714E794B354178E09B37D8E39BFDB62E9956A87572C765949FD8FB47280C6A98B400000000000000000000000000000000000047494654F23015F6');
  });

  it('should create for test giver without address', async () => {
    const res = await fift.receiveTestGrams({
      destAddress: '0f-cR3ku4pzylmqC8cE2b7HHN_tsXTKtUOrljsspP7H2jh5q',
      seqNo: '0x9A15',
      amount: '6.666',
    });

    assert.equal(res, 'B5EE9C7241010201006A00014F89FFF9723474702DA1EF71858EC211715378B4D6F4AB7AF3F1562038A5B6524644C0000004D0A80C01007A427FCE23BC97714E794B354178E09B37D8E39BFDB62E9956A87572C765949FD8FB47280C6A98B400000000000000000000000000000000000047494654F23015F6');
  });

  it('should create send gram message', async () => {
    const res = await fift.sendGrams({
      privateKey: 'df66ef003a3b924e5d6f284a9b0cb002bd061b5e8fc97ca566587400018899fb',
      workchainId: 0,
      destAddress: '0f8gBl8-wqN_wM38jE6Pel_Wg7ma0Ri86H-DpvQpX-sRxey6',
      seqNo: '0x9A15',
      amount: '6.666',
    });

    assert.ok(res);
  });

  it('should create send gram message with message hello', async () => {
    const res = await fift.sendGrams({
      privateKey: 'df66ef003a3b924e5d6f284a9b0cb002bd061b5e8fc97ca566587400018899fb',
      workchainId: -1,
      destAddress: '0f8gBl8-wqN_wM38jE6Pel_Wg7ma0Ri86H-DpvQpX-sRxey6',
      seqNo: '0x9A15',
      amount: '6.666',
      message: 'hello',
    });

    assert.ok(res);
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

  // its unable to compare files in v2 wallet because there is timeout feature
  // it('should equal boc files when using usual fif send and patched', async () => {
  //   const patched = await fift.sendGrams({
  //     privateKey: 'df66ef003a3b924e5d6f284a9b0cb002bd061b5e8fc97ca566587400018899fb',
  //     workchainId: 0,
  //     destAddress: '0f8gBl8-wqN_wM38jE6Pel_Wg7ma0Ri86H-DpvQpX-sRxey6',
  //     seqNo: '0x9A15',
  //     amount: '6.666',
  //   });
  //
  //   const ethalon = await fift.sendGrams({
  //     filesDir: __dirname,
  //     filenameBase: 'my_wallet_name',
  //     destAddress: '0f8gBl8-wqN_wM38jE6Pel_Wg7ma0Ri86H-DpvQpX-sRxey6',
  //     seqNo: '0x9A15',
  //     amount: '6.666',
  //   });
  //
  //   assert.equal(patched, ethalon);
  // });
});
