import React from "react";
import web3Context from "../context/web3Context";
import useWeb3Info from "./useWeb3Info";
import { ethers } from "ethers";
import { useContractBase } from "./useContractBase";

export default function useContract() {
  // const web3 = React.useContext(web3Context);
  const web3Info = useWeb3Info();
  //
  // const provider = web3.provider?.provider;
  const { contractAddress, abi } = web3Info || {};
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
