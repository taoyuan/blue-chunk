import {assemble} from "../src";
import {assert} from "chai";

describe('assemble', () => {
  it('should assemble chunks', (done) => {
    const expected = Buffer.from('abcdefghijklmnopqrstuvwxyz');
    const chunks = [
      Buffer.from([0x00, 0x00, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70]),
      Buffer.from([0x10, 0x80, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a])
    ];

    const assembler = assemble(data => {
      assert.deepEqual(data, expected);
      done();
    });

    for (let i = 0; i < chunks.length; i++) {
      assembler.feed(chunks[i]);
    }

  });
});
