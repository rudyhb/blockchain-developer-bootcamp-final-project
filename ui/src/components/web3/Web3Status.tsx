import React from "react";
import { BigNumber, utils } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

export default function Web3Status() {
  const context = useWeb3React<Web3Provider>();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error
  } = context;
  const address = account;
  const [money, setMoney] = React.useState<BigNumber>(BigNumber.from(0));
  const network = library?.network;

  React.useEffect(() => {
    if (!library || !account) {
      setMoney(BigNumber.from(0));
      return;
    }
    let stop = false;

    library.getSigner(account)
      .getBalance()
      .then(balance => {
        if (stop) return;
        console.log('got balance!');
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
  }, [address, library]);

  return (
    <>
      <p>network: {network?.name}</p>
      <p>address: {address}</p>
      <p>monies: {utils.formatEther(money)}</p>
    </>
  );
}
