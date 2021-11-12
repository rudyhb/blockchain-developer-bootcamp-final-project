import React from "react";
import styles from "./Web3Button.module.css";
import { Web3Options, web3Providers } from "../../interfaces/Web3";
import web3Context from "../../context/web3Context";
import { MetamaskTypes } from "../../hooks/useMetamask";
import MetamaskButton from "./MetamaskButton";
import RpcButton from "./RpcButton";
import Web3Status from "./Web3Status";

export default function Web3Button({
  setWeb3Options,
  metamaskConfig
}: {
  setWeb3Options: React.Dispatch<React.SetStateAction<Web3Options>>;
  metamaskConfig: MetamaskTypes;
}) {
  const provider = React.useContext(web3Context);

  const otherProvider: web3Providers =
    provider.options.provider === "metamask" ? "rpc" : "metamask";
  const toggleProvider = () => {
    setWeb3Options(options => ({
      ...options,
      provider: otherProvider
    }));
  };

  return (
    <div className={styles.web3Btn}>
      <button onClick={toggleProvider}>Change to {otherProvider}</button>
      {provider.options.provider === "metamask" && (
        <MetamaskButton
          metamaskConfig={metamaskConfig}
          provider={provider.provider}
        />
      )}
      {provider.options.provider === "rpc" && (
        <RpcButton
          web3Options={provider.options}
          setWeb3Options={setWeb3Options}
        />
      )}
      <Web3Status provider={provider.provider} />
    </div>
  );
}
