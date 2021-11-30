// from @web3-react
import { InjectedConnector } from "@web3-react/injected-connector";
import { supportedChainIds } from "../constants/web3Constants";
import { NetworkConnector } from "./NetworkConnector";
import env from "react-dotenv";

// console.log('env:', env)

export const injected = new InjectedConnector({
  supportedChainIds: supportedChainIds.map(c => c.chainId)
});

let network: NetworkConnector | null = null;
if (env.USE_LOCAL_RPC && env.RPC_URL && env.RPC_CHAIN_ID) {
  const chainId = parseInt(env.RPC_CHAIN_ID);
  if (chainId) {
    const RPC_URLS: { [chainId: number]: string } = {
      [chainId]: env.RPC_URL as string
    };

    network = new NetworkConnector({
      urls: { [chainId]: RPC_URLS[chainId] },
      defaultChainId: chainId
    });
  }
}

export { network };
