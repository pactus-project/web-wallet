import { WalletCore, initWasm } from '@trustwallet/wallet-core';
import { HDWallet } from '@trustwallet/wallet-core/dist/src/wallet-core';


export class Wallet {
  private wallet: HDWallet;
  private walletCore: WalletCore;

  constructor(_walletCore: WalletCore, entropy: number, password: string) {
    this.walletCore = _walletCore;
    this.wallet = this.walletCore.HDWallet.create(entropy, password);
  }

  newEd25519Address(label: string): string {
    const address = this.wallet.getAddressForCoin(this.walletCore.CoinType.pactus);

    return address
  }
}
