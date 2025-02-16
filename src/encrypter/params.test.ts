import { Params } from "./params";

describe("Params", () => {
  let params: Params;

  beforeEach(() => {
    params = new Params();
  });

  test("set and get Number", () => {
    const tests: { key: string; val: number }[] = [
      { key: "k1", val: 0 },
      { key: "k2", val: 0xff },
      { key: "k3", val: 0xffffffff },
      { key: "k4", val: 0xFFFFFFFFFFFFFFFF },
    ];

    for (const { key, val } of tests) {
      params.setNumber(key, val);
      expect(params.getNumber(key)).toBe(val);
    }
  });

  test("set and get Bytes", () => {
    const tests: { key: string; val: Uint8Array, base64: string }[] = [
      { key: "k1", val: new Uint8Array([0, 0]), base64: "AAA=" },
      { key: "k2", val: new Uint8Array([0xff, 0xff]), base64: "//8=" },
      { key: "k3", val: new Uint8Array([]), base64: "" },
    ];

    for (const { key, val, base64 } of tests) {
      params.setBytes(key, val);

      expect(params.getBytes(key)).toEqual(val);
      expect(params.getString(key)).toEqual(base64);
    }
  });

  test("set and get String", () => {
    const tests: { key: string; val: string }[] = [
      { key: "k1", val: "foo" },
      { key: "k2", val: "bar" },
      { key: "k3", val: "bar" },
    ];

    for (const { key, val } of tests) {
      params.setString(key, val);
      expect(params.getString(key)).toBe(val);
    }
  });
});
