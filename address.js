const crc16 = require('crc16');
const base64url = require('base64url');

class Address {
  constructor({ workchainId, account, fift }) {
    this.workchainId = workchainId;
    this.account = account;
    this.fift = fift;
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

    return new Address({ workchainId: payload.readInt8(1), account: payload.slice(2, 34) });
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
