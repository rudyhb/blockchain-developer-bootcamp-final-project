import React from "react";
import useWeb3Info from "./useWeb3Info";
import { ethers } from "ethers";
import { useContractBase } from "./useContractBase";
import { useWeb3React } from "@web3-react/core";

export default function useContract() {
  // const web3 = React.useContext(web3Context);
  const { chainId } = useWeb3React();
  const web3Info = useWeb3Info();
  //
  // const provider = web3.provider?.provider;
  const { localContractAddress, deployedContractAddresses, abi } =
    web3Info || {};
  const contractAddress =
    (deployedContractAddresses &&
      chainId &&
      deployedContractAddresses[chainId]) ||
    localContractAddress;
  //
  // return React.useMemo(
  //   () =>
  //     !provider || !contractAddress || !abi
  //       ? null
  //       : new ethers.Contract(contractAddress, abi, provider),
  //   [provider, contractAddress, abi]
  // );

  return useContractBase(contractAddress, abi);
}
