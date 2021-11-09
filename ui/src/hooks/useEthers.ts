import { ethers } from "ethers";

export type web3Providers = "metamask";

export interface EthersFunctionality {
  web3Connected: web3Providers;
  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;
  getNetwork: () => string;
  getSelectedAddress: () => Promise<string>;
  onClickConnect: () => Promise<void>;
  onAccountChange: (fallback: () => void) => void;
  offAccountChange: (fallback: () => void) => void;
}

export interface NullEthers {
  web3Connected: "none";
}

export type UseEthersReturn = EthersFunctionality | NullEthers;

// A Web3Provider wraps a standard Web3 provider, which is
// what MetaMask injects as window.ethereum into each page
const provider =
  window.ethereum && window.ethereum.isMetaMask
    ? new ethers.providers.Web3Provider(window.ethereum)
    : null;

// The MetaMask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
const signer = provider?.getSigner();

class EthersFunctions implements EthersFunctionality {
  public web3Connected: web3Providers;
  public provider: ethers.providers.Web3Provider;
  public signer: ethers.providers.JsonRpcSigner;

  constructor(
    web3Provider: web3Providers,
    provider: ethers.providers.Web3Provider,
    signer: ethers.providers.JsonRpcSigner
  ) {
    this.web3Connected = web3Provider;
    this.provider = provider;
    this.signer = signer;
  }

  getNetwork() {
    return this.provider.network?.name;
  }

  async getSelectedAddress() {
    return this.signer.getAddress();
  }

  async onClickConnect() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  onAccountChange(fallback: () => void) {
    window.ethereum.on("accountsChanged", fallback);
  }

  offAccountChange(fallback: () => void) {
    window.ethereum.removeListener("accountChanged", fallback);
  }
}

const metamaskFunctions =
  (provider && signer && new EthersFunctions("metamask", provider, signer)) ||
  null;

if (provider)
  // Force page refreshes on network changes
  provider.on("network", (newNetwork, oldNetwork) => {
    // When a Provider makes its initial connection, it emits a "network"
    // event with a null oldNetwork along with the newNetwork. So, if the
    // oldNetwork exists, it represents a changing network
    if (oldNetwork) {
      window.location.reload();
    }
  });

export default function useEthers(): UseEthersReturn {
  return (
    metamaskFunctions || {
      web3Connected: "none",
    }
  );
}
