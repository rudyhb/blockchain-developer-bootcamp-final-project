import React from "react";
import "./App.css";
import TokenManagement from "./components/TokenManagement";

import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";
import NavBar from "./components/NavBar";
import { BigNumber } from "ethers";
import UserDashboard from "./components/UserDashboard";

function getLibrary(provider: any): JsonRpcProvider {
  let library: JsonRpcProvider;
  if (
    provider.isMetaMask === false &&
    provider.host &&
    typeof provider.host === "string"
  ) {
    library = new JsonRpcProvider(provider);
  } else {
    library = new Web3Provider(provider);
  }
  library.pollingInterval = 12000;
  return library;
}

export default function App() {
  const [nftId, setNftId] = React.useState<BigNumber | null>(null);
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <NavBar />
      <TokenManagement setNftId={setNftId} />
      <UserDashboard nftId={nftId || undefined} />
    </Web3ReactProvider>
  );
}
