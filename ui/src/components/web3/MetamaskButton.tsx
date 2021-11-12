import React from "react";
import { MetamaskTypes } from "../../hooks/useMetamask";
import styles from "./MetamaskButton.module.css";
import useAddress from "../../hooks/useAddress";
import { EthersFunctionality } from "../../interfaces/Web3";

export default function MetamaskButton({
  metamaskConfig,
  provider
}: {
  metamaskConfig: MetamaskTypes;
  provider: EthersFunctionality | null;
}) {
  const metamask = metamaskConfig;
  const address = useAddress({ provider, connectionId: metamask.connectionId });
  const connected = address !== null;

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

  const { onClickConnect } = metamask;

  if (!connected)
    return (
      <div className={styles.metamaskBtn}>
        <button onClick={onClickConnect}>Connect to metamask</button>
      </div>
    );

  return (
    <div className={styles.metamaskBtn}>
      <p>Connected to Metamask</p>
    </div>
  );
}
