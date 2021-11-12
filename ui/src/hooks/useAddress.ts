import React from "react";
import { EthersFunctionality } from "../interfaces/Web3";

export default function useAddress({
  provider,
  connectionId
}: {
  provider: EthersFunctionality | null;
  connectionId?: symbol;
}) {
  const [address, setAddress] = React.useState<string | null>(null);
  const network = provider?.web3ConnectionDetails || null;

  React.useEffect(() => {
    if (!provider) {
      setAddress(null);
      return;
    }

    let stop = false;

    console.log("getting address!");
    provider.signer
      .getAddress()
      .then(addr => {
        if (stop) return;
        setAddress(addr);
      })
      .catch(err => {
        if (stop) return;
        if (err.message && err.message.indexOf("unknown account #0") !== -1) {
          setAddress(null);
          return;
        }
        console.error(err);
        setAddress(null);
      });

    return () => {
      stop = true;
    };
  }, [provider, network, connectionId]);

  return address;
}
