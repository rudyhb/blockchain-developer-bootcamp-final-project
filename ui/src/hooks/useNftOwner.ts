import React from "react";
import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "ethers";

export default function useNftOwner({
  contract,
  nftId
}: {
  contract: Contract | null;
  nftId: BigNumber | null;
}) {
  const [owner, setOwner] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!nftId || !contract) return;
    setError(null);
    let cancel = false;
    contract
      .ownerOf(nftId)
      .then((response: any) => {
        if (!cancel) setOwner(response);
      })
      .catch((err: any) => {
        if (!cancel) setError(err.message);
      });

    return () => {
      cancel = true;
    };
  }, [nftId, contract]);

  return [error, owner] as const;
}
