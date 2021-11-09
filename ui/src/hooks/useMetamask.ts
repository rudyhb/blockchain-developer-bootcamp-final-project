import React from "react";
import useEthers, { EthersFunctionality } from "./useEthers";

const metamaskWebsite = "https://metamask.io/";

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
  connected: boolean;
  network: string | null;
  address: string | null;
  onClickConnect: () => void;
  ethers: EthersFunctionality;
}

export interface MetamaskFunctions {
  ethers?: EthersFunctionality;
  address?: string | null;
}

export type MetamaskTypes =
  | MetamaskNotInstalled
  | MetamaskError
  | MetamaskSuccess;

export default function useMetamask(): MetamaskTypes {
  const ethersFunctions = useEthers();
  const [connectionSymbol, setConnectionSymbol] = React.useState(Symbol());
  const [address, setAddress] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const network =
    (ethersFunctions.web3Connected === "metamask" &&
      ethersFunctions.getNetwork()) ||
    null;
  const notInstalled = ethersFunctions.web3Connected !== "metamask";

  const onClickConnect = () => {
    if (address) return;
    if (notInstalled) {
      return setError("metamask is not available");
    }
    ethersFunctions.onClickConnect().catch((err) => {
      console.error(err);
      setError(err.message);
    });
  };

  React.useEffect(() => {
    if (ethersFunctions.web3Connected !== "metamask") return;

    const fb = () => {
      setAddress(null);
      setConnectionSymbol(Symbol());
    };

    ethersFunctions.onAccountChange(fb);

    return () => {
      ethersFunctions.offAccountChange(fb);
    };
  }, [ethersFunctions, network]);

  React.useEffect(() => {
    if (notInstalled || address) return;

    let stop = false;

    ethersFunctions
      .getSelectedAddress()
      .then((addr) => {
        if (stop) return;
        setAddress(addr);
      })
      .catch((err) => {
        if (stop) return;
        if (err.message && err.message.indexOf("unknown account #0") !== -1) {
          setAddress(null);
          return;
        }
        console.error(err);
        setError(err.message);
      });

    return () => {
      stop = true;
    };
  }, [network, notInstalled, ethersFunctions, connectionSymbol, address]);

  if (notInstalled)
    return {
      notInstalled: true,
      isError: false,
      metamaskWebsite,
    };

  if (error)
    return {
      notInstalled: false,
      isError: true,
      error,
    };

  return {
    notInstalled: false,
    isError: false,
    connected: address !== null,
    address,
    network,
    onClickConnect,
    ethers: ethersFunctions,
  };
}
