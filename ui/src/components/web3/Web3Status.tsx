import React from "react";
import { EthersFunctionality } from "../../interfaces/Web3";
import { BigNumber, utils } from "ethers";
import useAddress from "../../hooks/useAddress";

export default function Web3Status({
  provider
}: {
  provider: EthersFunctionality | null;
}) {
  const address = useAddress({ provider });
  const [money, setMoney] = React.useState<BigNumber>(BigNumber.from(0));
  const network = provider?.web3ConnectionDetails || null;

  React.useEffect(() => {
    if (!provider || !address) {
      setMoney(BigNumber.from(0));
      return;
    }
    let stop = false;

    provider.signer
      .getBalance()
      .then(balance => {
        if (stop) return;
        setMoney(balance);
      })
      .catch(e => {
        if (stop) return;
        console.error(e);
        setMoney(BigNumber.from(0));
      });

    return () => {
      stop = true;
    };
  }, [address, provider]);

  return (
    <>
      <p>network: {network}</p>
      <p>address: {address}</p>
      <p>monies: {utils.formatEther(money)}</p>
    </>
  );
}
