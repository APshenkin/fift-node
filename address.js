const crc16 = require('crc16');
const base64url = require('base64url');

class Address {
  constructor({ workchainId, publicKey }) {
    this.workchainId = workchainId;
    this.publicKey = publicKey;
  }

  static parseFromRaw(string) {
    let [workchainId, publicKey] = string.split(':');
    workchainId = parseInt(workchainId, 10);
    publicKey = Buffer.from(publicKey, 'hex');
    return new Address({ workchainId, publicKey });
  }

  static parseFromUserFriendly(string) {
    const payload = base64url.toBuffer(string);

    return new Address({ workchainId: payload.readInt8(1), publicKey: payload.toString('hex', 2, 34) });
  }

  static parseFromFift(string) {
    const payload = Buffer.from(string, 'hex');

    return new Address({ workchainId: payload.readInt32BE(32), publicKey: payload.toString('hex', 0, 32) });
  }

  toRaw() {
    return `${this.workchainId}:${this.publicKey}`.toUpperCase();
  }

  toUserFriendly({ nonBounce = false } = {}) {
    const tag = nonBounce ? 0x51 : 0x11;

    const payload = Buffer.alloc(34);

    payload.fill(tag, 0, 1);
    payload.writeInt8(this.workchainId, 1);
    payload.fill(this.publicKey, 2);

    const crc = crc16(payload);

    return base64url(Buffer.concat([payload, Buffer.from(crc.toString(16), 'hex')]));
  }

  toFift() {
    const payload = Buffer.alloc(36);

    payload.fill(this.publicKey);
    payload.writeInt32BE(this.workchainId, 32);

    return payload.toString('hex').toUpperCase();
  }
}

module.exports = Address;
