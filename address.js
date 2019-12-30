const crc16 = require('@kronoslive/crc16');
const base64url = require('base64url');

class Address {
  constructor({
    workchainId, account, fift, mainnet,
  }) {
    this.workchainId = workchainId;
    this.account = account;
    this.fift = fift;
    this.mainnet = mainnet;
  }

  static parseFromRaw(string) {
    // eslint-disable-next-line prefer-const
    let [workchainId, account] = string.split(':');
    workchainId = parseInt(workchainId, 10);
    account = Buffer.from(account, 'hex');
    return new Address({ workchainId, account });
  }

  static parseFromUserFriendly(string) {
    const payload = base64url.toBuffer(string);

    if (payload.byteLength !== 36) {
      throw new Error('User Friendly address should contains 36 bytes');
    }

    const crc = crc16(payload.slice(0, 34));

    if (Buffer.compare(Buffer.from(crc.toString(16).padStart(4, '0'), 'hex'), payload.slice(34, 36)) !== 0) {
      throw new Error('Crc 16 mismatch');
    }

    const tag = payload.readInt8(0);

    let main = false;
    if (tag === 0x51 || tag === 0x11) {
      main = true;
    }

    return new Address({ workchainId: payload.readInt8(1), account: payload.slice(2, 34), mainnet: main });
  }

  static parseFromFift(string) {
    const payload = Buffer.from(string, 'hex');

    return new Address({ workchainId: payload.readInt32BE(32), account: payload.slice(0, 32) });
  }

  static async parseFromWalletPrivateKey({ privateKey, workchainId, fift }) {
    const wallet = await fift.createNewWallet({ workchainId: workchainId.toString(), privateKey });
    return wallet.address;
  }

  static async parseFromWalletPublicKey({ publicKey, workchainId, fift }) {
    const address = await fift.getWalletAddress({ workchainId: workchainId.toString(), publicKey });
    return address;
  }

  toRaw() {
    return `${this.workchainId}:${this.account.toString('hex')}`.toUpperCase();
  }

  toUserFriendly({ nonBounce = false, mainnet = false } = {}) {
    const tag = (nonBounce ? 0x51 : 0x11) + (mainnet ? 0x00 : 0x80);

    const payload = Buffer.alloc(34);

    payload.fill(tag, 0, 1);
    payload.writeInt8(this.workchainId, 1);
    payload.fill(this.account, 2);

    const crc = crc16(payload);

    return base64url(Buffer.concat([payload, Buffer.from(crc.toString(16).padStart(4, '0'), 'hex')]));
  }

  toFift() {
    const payload = Buffer.alloc(36);

    payload.fill(this.account);
    payload.writeInt32BE(this.workchainId, 32);

    return payload.toString('hex').toUpperCase();
  }
}

module.exports = Address;
