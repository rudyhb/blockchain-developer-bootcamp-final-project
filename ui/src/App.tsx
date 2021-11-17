import React from "react";
import "./App.css";
import TokenManagement from "./components/TokenManagement";

import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";
import Web3Button from "./components/web3/Web3Button";
import Signer from "./components/web3/Signer";
import Web3Details from "./components/web3/Web3Details";

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
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3Button />
      <hr style={{ margin: "2rem" }} />
      <Web3Details />
      <hr style={{ margin: "2rem" }} />

      <Signer />
      <TokenManagement />
    </Web3ReactProvider>
  );
}
