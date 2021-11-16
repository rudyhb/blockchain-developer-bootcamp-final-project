import React from "react";
import { Fragment, JsonFragment } from "@ethersproject/abi";

interface Web3Info {
  contractAddress?: string;
  abi?: ReadonlyArray<Fragment | JsonFragment | string>;
}

const importDetails: () => Promise<Web3Info> = async () => {
  try {
    const developDetails: any = await import(
      "../web3Info/develop-details.json"
    );
    if (developDetails) {
      const formattedDetails: Web3Info = {};
      if (typeof developDetails.contractAddress === "string")
        formattedDetails.contractAddress = developDetails.contractAddress;
      if (developDetails.abi && Array.isArray(developDetails.abi))
        formattedDetails.abi = developDetails.abi;

      return formattedDetails;
    }
  } catch {}
  return {};
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
