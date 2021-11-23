import useWeb3Info from "./useWeb3Info";
import { useContractBase } from "./useContractBase";
import { useWeb3React } from "@web3-react/core";

export default function useContract() {
  const { chainId } = useWeb3React();
  const web3Info = useWeb3Info();

  const {
    localContractAddress,
    deployedContractAddresses,
    localAbi,
    deployedAbi
  } = web3Info || {};
  const contractAddress =
    (deployedContractAddresses &&
      chainId &&
      deployedContractAddresses[chainId]) ||
    localContractAddress;
  const abi = (deployedAbi && chainId && deployedAbi[chainId]) || localAbi;

  return useContractBase(contractAddress, abi);
}
