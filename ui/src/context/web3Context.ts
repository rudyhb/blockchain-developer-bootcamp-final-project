import React from "react";
import { EthersFunctionality, Web3Options } from "../interfaces/Web3";

export interface IWeb3ProviderContext {
  provider: EthersFunctionality | null;
  options: Web3Options;
}

const web3Context = React.createContext<IWeb3ProviderContext>({
  provider: null,
  options: {
    provider: "metamask",
    url: "http://localhost:9545"
  }
});

export default web3Context;
