import React from "react";
import { EthersFunctionality, web3Providers } from "../interfaces/Web3";
import { ethers } from "ethers";

class JsonRpcFunctionality implements EthersFunctionality {
  public web3Connected: web3Providers;
  public provider: ethers.providers.JsonRpcProvider;
  public signer: ethers.providers.JsonRpcSigner;

  constructor(url: string) {
    this.web3Connected = "rpc";
    this.provider = new ethers.providers.JsonRpcProvider(url);
    this.signer = this.provider.getSigner();
  }

  get web3ConnectionDetails() {
    return this.provider.connection.url;
  }
}

export default function useRpc({
  url,
  disabled
}: {
  url: string;
  disabled: boolean;
}): EthersFunctionality | null {
  const [provider, setProvider] = React.useState<EthersFunctionality | null>(
    null
  );

  React.useEffect(() => {
    const newProvider = disabled ? null : new JsonRpcFunctionality(url);
    if (newProvider) {
      setProvider(newProvider);
    } else {
      setProvider(null);
    }

    return () => {
      //TODO: need to clean up newProvider?
    };
  }, [disabled, url]);

  return provider;
}
