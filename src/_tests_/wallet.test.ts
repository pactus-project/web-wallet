import { initWasm } from "@trustwallet/wallet-core";
import { Wallet } from "../wallet";

describe("Wallet", () => {
  let wallet: Wallet;
  beforeEach(async () => {
    const core = await initWasm();
    wallet = new Wallet(core, 128, "password");
  });

  it("should create a new address", async () => {
    let addr = wallet.newEd25519Address("");
    console.log(addr)
  });
})
