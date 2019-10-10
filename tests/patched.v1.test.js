const assert = require('assert');
const Fift = require('../index');

const fift = new Fift({ usePatchedFift: true });

describe('test patched contracts wallet v1', () => {
  it('should create wallet from pk', async () => {
    const res = await fift.createNewWallet({
      workchainId: '-1', privateKey: '3986E77DB85235C426D8DE224B1F095636F414CDF40B954419733E4BF3F3F0BC',
    });

    assert.equal(res.privateKey, '3986E77DB85235C426D8DE224B1F095636F414CDF40B954419733E4BF3F3F0BC');
    assert.equal(res.address.workchainId, -1);
    assert.equal(res.address.account.toString('hex'), 'e9ab61f13126417b1dfcdc3c2c3dc2a23cde3850b809428b2f82a8ed6d65799d');
    assert.equal(res.creatingQuery, 'B5EE9C724101030100E50002CF89FFD356C3E2624C82F63BF9B878587B854479BC70A1701285165F0551DADACAF33A119FA17707D378153A6252833103EAEE1C5D2AF0B2301DF5C33B6833A655CCE8158010EFE92C632BB1091A76E0AE8C5620939D9F38D95F20EDC6AE67B3876FC000C000000010010200A2FF0020DD2082014C97BA9730ED44D0D70B1FE0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54004800000000C9FFBEF20D30674EB53F7BCBA6D84F9A2DCBEFA99DE0C880E53A0983132565C494B6DA0B');
    assert.equal(res.creatingQueryHash, '075CF8640F80A4027DF20C83E92731383C1A2972C6A7795EF38C45B0EE9C25A8');
  });

  it('should create wallet address from public key', async () => {
    const res = await fift.getWalletAddress({
      workchainId: '-1', publicKey: 'C9FFBEF20D30674EB53F7BCBA6D84F9A2DCBEFA99DE0C880E53A0983132565C4',
    });

    assert.equal(res.workchainId, -1);
    assert.equal(res.account.toString('hex'), 'e9ab61f13126417b1dfcdc3c2c3dc2a23cde3850b809428b2f82a8ed6d65799d');
  });

  it('should create wallet without PK', async () => {
    const res = await fift.createNewWallet({
      workchainId: '-1',
    });

    assert.notEqual(res.privateKey, undefined);
    assert.notEqual(res.address, undefined);
    assert.notEqual(res.creatingQuery, undefined);
    assert.notEqual(res.creatingQueryHash, undefined);
  });

  it('should equal wallet without PK and from PK', async () => {
    const ethalon = await fift.createNewWallet({
      workchainId: '-1',
    });

    const patched = await fift.createNewWallet({
      workchainId: '-1', privateKey: ethalon.privateKey,
    });

    assert.equal(ethalon.creatingQuery, patched.creatingQuery);
    assert.equal(ethalon.creatingQueryHash, patched.creatingQueryHash);
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

    assert.equal(res.txRaw, 'B5EE9C724101020100A20001CF88010EF039000F0CEAD74ECC3EAF7BFC6C97F50A133497FCA09A92F2E89C6AD74A8801F39184E4D204CE12FAD14B6538548BD2F047FCFEF082DB3772308761EA34BF318C3F81B94A29F614C9EE6C2EB20293A3F54346EF9D4DDE796D8B5D5E055430200004D0A81C01006A427F90032F9F6151BFE066FE462747BD2FEB41DCCD688C5E743FC1D37A14AFF588E2A80C6A98B40000000000000000000000000000A6670EAD');
    assert.equal(res.externalTxId, '5A8E733C4928C4B180DC6B2BA24701FFC2733BC8E83C0E533B95C8EDCC37859B');
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

    assert.equal(res.txRaw, 'B5EE9C724101020100AB0001CF89FF0EF039000F0CEAD74ECC3EAF7BFC6C97F50A133497FCA09A92F2E89C6AD74A880634A8D40354103D8A8170740FA11244A783BA19B5FF99E1D38B9F9DE7E6AF33AAFC3608D3FECD6F2B51085A1854D11887751706F3EC7F5FF68191F35CC7FFC0280004D0A81C01007C427F90032F9F6151BFE066FE462747BD2FEB41DCCD688C5E743FC1D37A14AFF588E2A80C6A98B400000000000000000000000000000000000068656C6C6FF72D2744');
    assert.equal(res.externalTxId, 'B1A220EF3430EEBBB656FDDD78A7AD345F5EDEF667638581E239A0C2A82CC56A')
  });

  it('should create send gram message using files', async () => {
    const res = await fift.sendGrams({
      filesDir: __dirname,
      filenameBase: 'my_wallet_name',
      destAddress: '0f8gBl8-wqN_wM38jE6Pel_Wg7ma0Ri86H-DpvQpX-sRxey6',
      seqNo: '0x9A15',
      amount: '6.666',
    });

    assert.equal(res.txRaw, 'B5EE9C724101020100A20001CF88010EF039000F0CEAD74ECC3EAF7BFC6C97F50A133497FCA09A92F2E89C6AD74A8801F39184E4D204CE12FAD14B6538548BD2F047FCFEF082DB3772308761EA34BF318C3F81B94A29F614C9EE6C2EB20293A3F54346EF9D4DDE796D8B5D5E055430200004D0A81C01006A427F90032F9F6151BFE066FE462747BD2FEB41DCCD688C5E743FC1D37A14AFF588E2A80C6A98B40000000000000000000000000000A6670EAD');
    assert.equal(res.externalTxId, '5A8E733C4928C4B180DC6B2BA24701FFC2733BC8E83C0E533B95C8EDCC37859B');
  });

  it('should equal boc files when using usual fif send and patched', async () => {
    const patched = await fift.sendGrams({
      privateKey: 'df66ef003a3b924e5d6f284a9b0cb002bd061b5e8fc97ca566587400018899fb',
      workchainId: 0,
      destAddress: '0f8gBl8-wqN_wM38jE6Pel_Wg7ma0Ri86H-DpvQpX-sRxey6',
      seqNo: '0x9A15',
      amount: '6.666',
    });

    const ethalon = await fift.sendGrams({
      filesDir: __dirname,
      filenameBase: 'my_wallet_name',
      destAddress: '0f8gBl8-wqN_wM38jE6Pel_Wg7ma0Ri86H-DpvQpX-sRxey6',
      seqNo: '0x9A15',
      amount: '6.666',
    });

    assert.equal(patched.txRaw, ethalon.txRaw);
  });
});
