import React from "react";
import useMetamask from "../hooks/useMetamask";
import styles from "./MetamaskButton.module.css";
import { BigNumber, utils } from "ethers";

export default function MetamaskButton() {
  const metamask = useMetamask();
  const [money, setMoney] = React.useState<BigNumber>(BigNumber.from(0));

  React.useEffect(() => {
    if (!metamask.ethers || !metamask.address) {
      setMoney(BigNumber.from(0));
      return;
    }
    let stop = false;

    metamask.ethers.signer
      .getBalance()
      .then((balance) => {
        if (stop) return;
        setMoney(balance);
      })
      .catch((e) => {
        if (stop) return;
        console.error(e);
        setMoney(BigNumber.from(0));
      });

    return () => {
      stop = true;
    };
  }, [metamask.address, metamask.ethers]);

  if (metamask.notInstalled)
    return (
      <div className={styles.metamaskBtn}>
        <p>
          please install metamask{" "}
          <a href={metamask.metamaskWebsite} target="_blank" rel="noreferrer">
            here
          </a>
        </p>
      </div>
    );

  if (metamask.isError)
    return (
      <div className={styles.metamaskBtn}>
        <p>error: {metamask.error}</p>
      </div>
    );

  const { connected, address, network, onClickConnect } = metamask;

  if (!connected)
    return (
      <div className={styles.metamaskBtn}>
        <button onClick={onClickConnect}>Connect to metamask</button>
      </div>
    );

  return (
    <div className={styles.metamaskBtn}>
      <p>network: {network}</p>
      <p>address: {address}</p>
      <p>monies: {utils.formatEther(money)}</p>
    </div>
  );
}
