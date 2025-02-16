import { Params } from "./params"; // Assuming Params is in a separate module
import { randomBytes, createHash } from "crypto";
import  argon2id  from "argon2id";

const nameFuncNope = "";
const nameFuncArgon2ID = "ARGON2ID";
const nameFuncAES256CTR = "AES_256_CTR";
const nameFuncMACv1 = "MACV1";

export class Encrypter {
  method: string;
  params: Params;

  constructor(method = nameFuncNope, params = new Params()) {
    this.method = method;
    this.params = params;
  }

  static nope(): Encrypter {
    return new Encrypter(nameFuncNope);
  }

  static default(): Encrypter {
    const params = new Params();
    params.setUint32("iterations", 3);
    params.setUint32("memory", 65536);
    params.setUint8("parallelism", 4);

    return new Encrypter(`${nameFuncArgon2ID}-${nameFuncAES256CTR}-${nameFuncMACv1}`, params);
  }

  isEncrypted(): boolean {
    return this.method !== nameFuncNope;
  }

  async encrypt(message: string, password: string): Promise<string> {
    if (this.method === nameFuncNope) {
      if (password !== "") throw new Error("Invalid password");
      return message;
    }
    if (!password) throw new Error("Invalid password");

    const funcs = this.method.split("-");
    if (funcs.length !== 3) throw new Error("Method not supported");

    const salt = randomBytes(16);
    const iterations = this.params.getNumber("iterations");
    const memory = this.params.getNumber("memory");
    const parallelism = this.params.getNumber("parallelism");

    const hash = await argon2id({
      pass: password,
      salt,
      time: iterations,
      mem: memory,
      parallelism,
      hashLen: 32,
    });

    const cipherKey = Buffer.from(hash.hash);
    const iv = salt;
    const cipherText = await this.aesCrypt(Buffer.from(message, "utf8"), iv, cipherKey);
    const mac = this.calcMACv1(cipherKey.slice(16, 32), cipherText);

    return Buffer.concat([salt, cipherText, mac]).toString("base64");
  }

  async decrypt(cipherText: string, password: string): Promise<string> {
    if (this.method === nameFuncNope) {
      if (password !== "") throw new Error("Invalid password");
      return cipherText;
    }
    const funcs = this.method.split("-");
    if (funcs.length !== 3) throw new Error("Method not supported");

    const data = Buffer.from(cipherText, "base64");
    if (data.length < 20) throw new Error("Invalid cipher");

    const salt = data.slice(0, 16);
    const enc = data.slice(16, -4);
    const mac = data.slice(-4);

    const iterations = this.params.getNumber("iterations");
    const memory = this.params.getNumber("memory");
    const parallelism = this.params.getNumber("parallelism");

    const hash = await argon2id({
      pass: password,
      salt,
      time: iterations,
      mem: memory,
      parallelism,
      hashLen: 32,
    });

    const cipherKey = Buffer.from(hash.hash);
    if (!this.safeCompare(mac, this.calcMACv1(cipherKey.slice(16, 32), enc))) {
      throw new Error("Invalid password");
    }
    return (await this.aesCrypt(enc, salt, cipherKey)).toString("utf8");
  }

  private async aesCrypt(data: Buffer, iv: Buffer, key: Buffer): Promise<Buffer> {
    // Support CBC is better.
    const cryptoKey = await crypto.subtle.importKey("raw", key, "AES-CTR", true, ["encrypt", "decrypt"]);
    const encrypted = await crypto.subtle.encrypt({ name: "AES-CTR", counter: iv, length: 128 }, cryptoKey, data);
    return Buffer.from(encrypted);
  }

  private calcMACv1(...data: Buffer[]): Buffer {
    const hash = createHash("sha256");
    data.forEach(d => hash.update(d));
    return hash.digest().slice(0, 4);
  }

  private safeCompare(a: Buffer, b: Buffer): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
      diff |= a[i] ^ b[i];
    }
    return diff === 0;
  }
}
