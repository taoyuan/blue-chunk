import {fragment} from "../src";
import {assert} from "chai";

describe("fragment", () => {
  it("should fragment data less than MTU", async () => {
    const data = Buffer.from('abcd');
    const expected = [
      Buffer.from([0x00, 0x80, 0x61, 0x62, 0x63, 0x64]),
    ];
    const result: Buffer[] = [];

    await fragment(data, (chunk, index) => {
      result.push(chunk);
    });

    assert.deepEqual(result, expected);
  });

  it("should fragment data more than MTU", async () => {
    const data = Buffer.from('abcdefghijklmnopqrstuvwxyz');
    const expected = [
      Buffer.from([0x00, 0x00, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70]),
      Buffer.from([0x10, 0x80, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a])
    ];
    const result: Buffer[] = [];

    await fragment(data, (chunk, index) => {
      result.push(chunk);
    });

    assert.deepEqual(result, expected);
  });
});

