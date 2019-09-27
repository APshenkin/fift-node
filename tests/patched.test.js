const assert = require('assert');
const Fift = require('../index');

const fift = new Fift({ usePatchedFift: true });

describe('test patched contracts', () => {
  it('should create wallet from pk', async () => {
    const res = await fift.createNewWallet({
      workchainId: '-1', privateKey: '3986E77DB85235C426D8DE224B1F095636F414CDF40B954419733E4BF3F3F0BC',
    });

    assert.equal(res.privateKey, '3986E77DB85235C426D8DE224B1F095636F414CDF40B954419733E4BF3F3F0BC');
    assert.equal(res.address, 'E9AB61F13126417B1DFCDC3C2C3DC2A23CDE3850B809428B2F82A8ED6D65799DFFFFFFFF');
    assert.equal(res.creatingQuery, 'B5EE9C724104030100000000E50002CF89FFD356C3E2624C82F63BF9B878587B854479BC70A1701285165F0551DADACAF33A119FA17707D378153A6252833103EAEE1C5D2AF0B2301DF5C33B6833A655CCE8158010EFE92C632BB1091A76E0AE8C5620939D9F38D95F20EDC6AE67B3876FC000C000000010010200A2FF0020DD2082014C97BA9730ED44D0D70B1FE0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54004800000000C9FFBEF20D30674EB53F7BCBA6D84F9A2DCBEFA99DE0C880E53A0983132565C4361A8C30');
  });

  it('should create wallet without PK', async () => {
    const res = await fift.createNewWallet({
      workchainId: '-1',
    });

    assert.notEqual(res.privateKey, undefined);
    assert.notEqual(res.address, undefined);
    assert.notEqual(res.creatingQuery, undefined);
  });

  it('should create message for test giver', async () => {
    const res = await fift.receiveTestGrams({
      testGiverAddress: 'FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260FFFFFFFF',
      destAddress: '0f-cR3ku4pzylmqC8cE2b7HHN_tsXTKtUOrljsspP7H2jh5q',
      seqNo: '0x9A15',
      amount: '6.666',
    });

    assert.equal(res, 'B5EE9C7241040201000000006A00014F89FFF9723474702DA1EF71858EC211715378B4D6F4AB7AF3F1562038A5B6524644C0000004D0A80C01007A427FCE23BC97714E794B354178E09B37D8E39BFDB62E9956A87572C765949FD8FB47280C6A98B400000000000000000000000000000000000047494654F148555B');
  });

  it('should create for test giver without address', async () => {
    const res = await fift.receiveTestGrams({
      destAddress: '0f-cR3ku4pzylmqC8cE2b7HHN_tsXTKtUOrljsspP7H2jh5q',
      seqNo: '0x9A15',
      amount: '6.666',
    });

    assert.equal(res, 'B5EE9C7241040201000000006A00014F89FFF9723474702DA1EF71858EC211715378B4D6F4AB7AF3F1562038A5B6524644C0000004D0A80C01007A427FCE23BC97714E794B354178E09B37D8E39BFDB62E9956A87572C765949FD8FB47280C6A98B400000000000000000000000000000000000047494654F148555B');
  });

  it('should create send gram message', async () => {
    const res = await fift.sendGrams({
      privateKey: '4B8D1BBCB692A02DAD73FE9BD8A58A107CC320031EDA3B79E4C890CB0A38171F',
      sourceAddress: '3F5879DF600C4D1E2BBCD1AF8B6F17E3A52107F3AC826E071AB6FE1BFDE17FFCFFFFFFFF',
      destAddress: '0f8gBl8-wqN_wM38jE6Pel_Wg7ma0Ri86H-DpvQpX-sRxey6',
      seqNo: '0x9A15',
      amount: '6.666',
    });

    assert.equal(res, 'B5EE9C724104020100000000AA0001CF89FE7EB0F3BEC0189A3C5779A35F16DE2FC74A420FE75904DC0E356DFC37FBC2FFF803B5B532D9F10F82658B53974AC5218EAD263A649B534D2E1F91A4B7DA2CFBA90F292B799049DB74122DFCA6A9F951F171ADE685C7611BAD846B80FE196A3800180004D0A81C01007A427F90032F9F6151BFE066FE462747BD2FEB41DCCD688C5E743FC1D37A14AFF588E2A80C6A98B4000000000000000000000000000000000000544553544D51B7F9');
  });

  it('should create send gram message using files', async () => {
    const res = await fift.sendGrams({
      filesDir: __dirname,
      filenameBase: 'my_wallet_name',
      destAddress: '0f8gBl8-wqN_wM38jE6Pel_Wg7ma0Ri86H-DpvQpX-sRxey6',
      seqNo: '0x9A15',
      amount: '6.666',
    });

    assert.equal(res, 'B5EE9C724104020100000000AA0001CF88010EF039000F0CEAD74ECC3EAF7BFC6C97F50A133497FCA09A92F2E89C6AD74A8807EFD05FA24EBB18EF03DE4983A654BC24E49218D6C9DB131091A5AD9212AA77A57B3C61EAF19A71E43D723774E28CDAA094CC87EEC09A7D161351B1DE5EC528500004D0A81C01007A427F90032F9F6151BFE066FE462747BD2FEB41DCCD688C5E743FC1D37A14AFF588E2A80C6A98B4000000000000000000000000000000000000544553546D4EC2D7');
  });
});
