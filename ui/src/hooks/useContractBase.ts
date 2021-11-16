import { useMemo } from "react";
import {
  Contract
  // ContractInterface
} from "@ethersproject/contracts";
import { AddressZero } from "@ethersproject/constants";
import { useWeb3React } from "@web3-react/core";
import { JsonFragment } from "@ethersproject/abi";
import { ethers } from "ethers";

export function useContractBase(
  contractAddress: string | null | undefined,
  ABI: readonly (string | ethers.utils.Fragment | JsonFragment)[] | null | undefined
): Contract | null {
  if (contractAddress === AddressZero) {
    throw Error(`Invalid 'contractAddress' parameter '${contractAddress}'.`);
  }

  const { library, account } = useWeb3React();

  const signerOrProvider = account
    ? library.getSigner(account).connectUnchecked()
    : library;

  const connectionUrl: string | undefined = signerOrProvider?.provider?.connection?.url;

  return useMemo(() => {
    return !contractAddress || !ABI
      ? null
      : new Contract(contractAddress, ABI, signerOrProvider);
  }, [contractAddress, ABI, connectionUrl]);
}
