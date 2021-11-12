import React from "react";

interface Web3Info {
  url: string;
  mnemonic: string[];
  contractAddress: string;
  abi: unknown[];
}

const importDetails: () => Promise<Web3Info | null> = async () => {
  try {
    const developDetails: any = await import('../web3Info/develop-details.json');
    if (
      developDetails &&
      typeof developDetails.url === "string" &&
      typeof developDetails.contractAddress === "string" &&
      developDetails.abi &&
      Array.isArray(developDetails.abi) &&
      developDetails.mnemonic &&
      typeof developDetails.mnemonic === "string"
    ) {
      return {
        url: developDetails.url,
        mnemonic: developDetails.mnemonic.split(" "),
        contractAddress: developDetails.contractAddress,
        abi: developDetails.abi
      };
    }
  }
  catch {
  }
  return null;
}


export default function useWeb3Info(): Web3Info | null {
  const [info, setInfo] = React.useState<Web3Info | null>(null);

  React.useEffect(() => {
    let stop = false;
    importDetails().then(inf => {
      if (!stop)
        setInfo(inf);
    })

    return () => {
      stop = true;
    }
  }, []);

  return info;
}
