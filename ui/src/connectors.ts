// from @web3-react
import { InjectedConnector } from "@web3-react/injected-connector";
import { supportedChainIds } from "./constants/web3Constants";

export const injected = new InjectedConnector({
  supportedChainIds: supportedChainIds.map(c => c.chainId)
});
