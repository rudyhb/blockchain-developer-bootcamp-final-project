import env from "react-dotenv";

const supportedChainIds = [
  { chainId: 1, name: "mainnet" },
  { chainId: 3, name: "ropsten" },
  { chainId: 4, name: "rinkeby" },
  { chainId: 5, name: "göerli" },
  { chainId: 42, name: "kovan" },
];

if (env.USE_LOCAL_RPC)
  supportedChainIds.push({
    chainId: 1337, name: "local"
  })

export {
  supportedChainIds
}
