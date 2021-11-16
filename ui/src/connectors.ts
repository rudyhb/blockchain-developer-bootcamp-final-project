// from @web3-react
import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";

const RPC_URLS: { [chainId: number]: string } = {
  1337: "http://127.0.0.1:9545"
  // 1: process.env.RPC_URL_1 as string,
  // 4: process.env.RPC_URL_4 as string
};

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 1337]
});

export const network = new NetworkConnector({
  urls: { 1337: RPC_URLS[1337] },
  defaultChainId: 1337
});
