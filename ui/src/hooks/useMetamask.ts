import React from "react";
import { EthersFunctionality, web3Providers } from "../interfaces/Web3";
import { ethers } from "ethers";

const metamaskWebsite = "https://metamask.io/";

export interface IMetamaskFunctionality extends EthersFunctionality {
  onClickConnect: () => Promise<void>;
  onAccountChange: (fallback: () => void) => void;
  offAccountChange: (fallback: () => void) => void;
}

class MetamaskFunctionality implements IMetamaskFunctionality {
  public web3Connected: web3Providers;
  public provider: ethers.providers.Web3Provider;
  public signer: ethers.providers.JsonRpcSigner;

  constructor(
    provider: ethers.providers.Web3Provider,
    signer: ethers.providers.JsonRpcSigner
  ) {
    this.web3Connected = "metamask";
    this.provider = provider;
    this.signer = signer;
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

  get web3ConnectionDetails() {
    return `metamask ${this.provider.network?.name}`;
  }
}

// A Web3Provider_old wraps a standard Web3 provider, which is
// what MetaMask injects as window.ethereum into each page
const metamaskProvider =
  window.ethereum && window.ethereum.isMetaMask
    ? new ethers.providers.Web3Provider(window.ethereum)
    : null;

// The MetaMask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
const metamaskSigner = metamaskProvider?.getSigner();

const metamaskFunctions =
  (metamaskProvider &&
    metamaskSigner &&
    new MetamaskFunctionality(metamaskProvider, metamaskSigner)) ||
  null;

if (metamaskProvider)
  // Force page refreshes on network changes
  metamaskProvider.on("network", (newNetwork, oldNetwork) => {
    // When a Provider makes its initial connection, it emits a "network"
    // event with a null oldNetwork along with the newNetwork. So, if the
    // oldNetwork exists, it represents a changing network
    if (oldNetwork) {
      window.location.reload();
    }
  });

export interface MetamaskNotInstalled extends MetamaskFunctions {
  notInstalled: true;
  isError: false;
  metamaskWebsite: string;
}

export interface MetamaskError extends MetamaskFunctions {
  notInstalled: false;
  isError: true;
  error: string;
}

export interface MetamaskSuccess extends MetamaskFunctions {
  notInstalled: false;
  isError: false;
  // connected: boolean;
  onClickConnect: () => void;
  connectionId: symbol;
  ethers: EthersFunctionality;
}

export interface MetamaskFunctions {
  ethers?: EthersFunctionality;
  connectionId?: symbol;
}

export type MetamaskTypes =
  | MetamaskNotInstalled
  | MetamaskError
  | MetamaskSuccess;

export default function useMetamask({
  disabled
}: {
  disabled: boolean;
}): MetamaskTypes {
  // const [connectionSymbol, setConnectionSymbol] = React.useState(Symbol());
  const [error, setError] = React.useState<string | null>(null);
  const [connectionId, setConnectionId] = React.useState(Symbol());

  const notInstalled = metamaskFunctions === null;

  const onClickConnect = () => {
    if (notInstalled) {
      return setError("metamask is not available");
    }
    metamaskFunctions.onClickConnect().catch(err => {
      console.error(err);
      setError(err.message);
    });
  };

  React.useEffect(() => {
    if (disabled) {
      //TODO: disconnect?
      return;
    }

    if (!metamaskFunctions) return;

    const fb = () => {
      // setAddress(null);
      setConnectionId(Symbol());
    };

    metamaskFunctions.onAccountChange(fb);

    return () => {
      metamaskFunctions.offAccountChange(fb);
    };
  }, [disabled]);

  if (disabled || notInstalled)
    return {
      notInstalled: true,
      isError: false,
      metamaskWebsite
    };

  if (error)
    return {
      notInstalled: false,
      isError: true,
      error
    };

  return {
    notInstalled: false,
    isError: false,
    // connected: address !== null,
    connectionId,
    onClickConnect,
    ethers: metamaskFunctions
  };
}
