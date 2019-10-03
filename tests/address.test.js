const assert = require('assert');
const Address = require('../address');

const Fift = require('../index');

const fift = new Fift({ usePatchedFift: true });

describe('address', () => {
  it('should parse raw address and show it to UserFriendly', async () => {
    const res = Address.parseFromRaw('-1:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260').toUserFriendly({ mainnet: true });

    assert.equal(res, 'Ef_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYDJ4');
  });

  it('should parse raw address and show it to UserFriendly with non bounce', async () => {
    const res = Address.parseFromRaw('-1:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260').toUserFriendly({ nonBounce: true, mainnet: true });

    assert.equal(res, 'Uf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYG-9');
  });

  it('should parse user friendly and show it to raw', async () => {
    const res = Address.parseFromUserFriendly('Ef_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYDJ4').toRaw();

    assert.equal(res, '-1:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260');
  });

  it('should parse from fift hex file', async () => {
    const res = Address.parseFromFift('FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260FFFFFFFF').toRaw();

    assert.equal(res, '-1:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260');
  });

  it('should parse from raw and show in fift', async () => {
    const res = Address.parseFromRaw('-1:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260').toFift();

    assert.equal(res, 'FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260FFFFFFFF');
  });

  it('should parse raw address and show it to UserFriendly for testnet', async () => {
    const res = Address.parseFromRaw('0:e8133d6390e891e0f7b6870e6ac1db8f9108e760939fa647ec48fa5b72ac5edf').toUserFriendly();

    assert.equal(res, 'kQDoEz1jkOiR4Pe2hw5qwduPkQjnYJOfpkfsSPpbcqxe3xtm');
  });

  it('should parse raw address and show it to UserFriendly for testnet with non bounce', async () => {
    const res = Address.parseFromRaw('0:e8133d6390e891e0f7b6870e6ac1db8f9108e760939fa647ec48fa5b72ac5edf').toUserFriendly({ nonBounce: true });

    assert.equal(res, '0QDoEz1jkOiR4Pe2hw5qwduPkQjnYJOfpkfsSPpbcqxe30aj');
  });

  it('should parse address from private key', async () => {
    const res = await Address.parseFromWalletPrivateKey({ workchainId: -1, privateKey: '3986E77DB85235C426D8DE224B1F095636F414CDF40B954419733E4BF3F3F0BC', fift });

    assert.equal(res.toFift(), 'E9AB61F13126417B1DFCDC3C2C3DC2A23CDE3850B809428B2F82A8ED6D65799DFFFFFFFF');
  });

  it('should parse address from public key', async () => {
    const res = await Address.parseFromWalletPublicKey({ workchainId: -1, publicKey: 'C9FFBEF20D30674EB53F7BCBA6D84F9A2DCBEFA99DE0C880E53A0983132565C4', fift });

    assert.equal(res.toFift(), 'E9AB61F13126417B1DFCDC3C2C3DC2A23CDE3850B809428B2F82A8ED6D65799DFFFFFFFF');
  });
});
