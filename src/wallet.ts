import { WalletCore, initWasm } from '@trustwallet/wallet-core';
import { HDWallet } from '@trustwallet/wallet-core/dist/src/wallet-core';

let walletCore: WalletCore;

// Synchronously initialize WalletCore before using the Wallet class
(async () => {
  walletCore = await initWasm();
})();

export class Wallet {
  private wallet: HDWallet;

  private constructor(wallet: HDWallet) {
    this.wallet = wallet;
  }

  static create(entropy: number, password: string): Wallet {
    const wallet = walletCore.HDWallet.create(entropy, password);



    return new Wallet( wallet);
  }

  newEd25519Address(label: string): string {
    const address = this.wallet.getAddressForCoin(walletCore.CoinType.pactus);

    return address
  }
}
