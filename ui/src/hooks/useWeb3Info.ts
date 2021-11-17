import React from "react";
import { Fragment, JsonFragment } from "@ethersproject/abi";

interface Web3Info {
  localContractAddress?: string;
  deployedContractAddresses?: { [chainId: number]: string };
  abi?: ReadonlyArray<Fragment | JsonFragment | string>;
}

const importDetails: () => Promise<Web3Info> = async () => {
  const formattedDetails: Web3Info = {};
  try {
    const developDetails: any = await import(
      "../web3Info/develop-details.json"
    );
    console.log(developDetails)
    if (developDetails && developDetails.useLocalRpc) {
      if (typeof developDetails.contractAddress === "string")
        formattedDetails.localContractAddress = developDetails.contractAddress;
      if (developDetails.abi && Array.isArray(developDetails.abi))
        formattedDetails.abi = developDetails.abi;
    }
  } catch {}
  try {
    const deploymentDetails = (await import("../web3Info/deployment-details"))
      .default;
    formattedDetails.deployedContractAddresses = deploymentDetails;
  } catch {}
  return formattedDetails;
};

export default function useWeb3Info(): Web3Info | null {
  const [info, setInfo] = React.useState<Web3Info | null>(null);

  React.useEffect(() => {
    let stop = false;
    importDetails().then(inf => {
      if (!stop) setInfo(inf);
    });

    return () => {
      stop = true;
    };
  }, []);

  return info;
}
