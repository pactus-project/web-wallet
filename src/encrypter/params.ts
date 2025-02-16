export class Params {
  private data: Map<string, string>;

  constructor() {
    this.data = new Map<string, string>();
  }

  setNumber(key: string, val: number): void {
    this.data.set(key, val.toString());
  }

  setBytes(key: string, val: Uint8Array): void {
    this.data.set(key, btoa(String.fromCharCode(...val)));
  }

  setString(key: string, val: string): void {
    this.data.set(key, val);
  }

  getNumber(key: string): number {
    const val = this.data.get(key);
    if (val == undefined) throw new Error(`Key "${key}" not found`);

    return parseInt(val, 10);
  }

  getBytes(key: string): Uint8Array {
    const val = this.data.get(key);
    if (val == undefined) throw new Error(`Key "${key}" not found`);

    return new Uint8Array([...atob(val)].map(c => c.charCodeAt(0)));
  }

  getString(key: string): string {
    const val = this.data.get(key);
    if (val == undefined) throw new Error(`Key "${key}" not found`);

    return val;
  }
}
