import { ethers } from "ethers";

export type web3Providers = "metamask" | "rpc";

export interface EthersFunctionality {
  web3Connected: web3Providers;
  web3ConnectionDetails: string;
  provider: ethers.providers.JsonRpcProvider;
  signer: ethers.providers.JsonRpcSigner;
}

export interface Web3Options {
  provider: web3Providers;
  url: string;
}
