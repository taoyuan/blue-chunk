const DEFAULT_CHUNK_SIZE = 16;

export interface OnChunk {
  (chunk: Buffer, index: number): any
}

export async function fragment(data: Buffer, mtu: number, onChunk: OnChunk);
export async function fragment(data: Buffer, onChunk: OnChunk);
export async function fragment(data: Buffer, mtu: number | OnChunk, onChunk?: OnChunk) {
  if (typeof mtu === 'function') {
    onChunk = mtu;
    mtu = DEFAULT_CHUNK_SIZE;
  }

  mtu = mtu || DEFAULT_CHUNK_SIZE;

  if (!onChunk) return;

  let i = 0;
  for (let n = 0; n < data.length; n += mtu) {
    let flags = 0;
    // mark final message
    if (n + mtu >= data.length) {
      flags |= 0x8000;
    }

    let end = n + mtu;
    if (end > data.length) {
      end = data.length;
    }

    const buf = data.slice(n, end);
    const chunk = Buffer.allocUnsafe(buf.length + 2);
    chunk.writeUInt16LE(n | flags, 0);
    buf.copy(chunk, 2, 0);
    let result: any = onChunk(chunk, i++);
    if (result && typeof result.then === 'function') {
      result = await result;
    }
    if (result === false) {
      return;
    }
  }
}
