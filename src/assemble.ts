
export function assemble(cb: Function): Assembler {
  return new Assembler(cb);
}

export class Assembler {
  protected _cb: Function;
  protected _buf: Buffer;
  protected _len: number;

  constructor(cb: Function) {
    this._cb = cb;
  }

  protected reset() {
    this._buf = Buffer.allocUnsafe(0);
    this._len = 0;
  }

  feed(chunk: Buffer) {
    if (chunk.length <= 2) {
      this.reset();
    }

    const offset = chunk.readUInt16LE(0);
    if (this._len !== (offset & 0x7FFF)) {
      this.reset();
    }

    this._len += chunk.length - 2;
    this._buf = Buffer.concat([this._buf, chunk.slice(2)], this._len);
    if (offset & 0x8000) {
      this._cb(this._buf);
      this.reset();
    }
  }
}
