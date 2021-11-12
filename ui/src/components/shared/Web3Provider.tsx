import React from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import web3Context from "../../context/web3Context";
import { EthersFunctionality, Web3Options } from "../../interfaces/Web3";
import useMetamask, { MetamaskTypes } from "../../hooks/useMetamask";
import useRpc from "../../hooks/useRpc";

export default function Web3Provider({
  children,
  render
}: {
  children?: React.ReactElement;
  render?: (args: {
    setWeb3Options: React.Dispatch<React.SetStateAction<Web3Options>>;
    metamaskConfig: MetamaskTypes;
  }) => React.ReactElement;
}) {
  const [web3Options, setWeb3Options] = useLocalStorage<Web3Options>(
    "Web3Options",
    {
      provider: "metamask",
      url: "http://localhost:9545"
    },
    true
  );

  const metamask = useMetamask({
    disabled: web3Options.provider !== "metamask"
  });
  const rpc = useRpc({
    url: web3Options.url,
    disabled: web3Options.provider !== "rpc"
  });

  let provider: EthersFunctionality | null;
  if (rpc !== null) {
    provider = rpc;
  } else if (!metamask.notInstalled && !metamask.isError) {
    provider = metamask.ethers;
  } else {
    provider = null;
  }

  return (
    <web3Context.Provider
      value={{
        provider,
        options: web3Options
      }}>
      {render && render({ setWeb3Options, metamaskConfig: metamask })}
      {children}
    </web3Context.Provider>
  );
}
