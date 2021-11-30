import React from "react";
import { BigNumber } from "ethers";
import { Contract } from "@ethersproject/contracts";

export default function NftImg({
  id,
  contract,
  style
}: {
  id: BigNumber;
  contract: Contract | null;
  style?: React.CSSProperties;
}) {
  const [src, setSrc] = React.useState<string | undefined>();

  React.useEffect(() => {
    if (!contract) {
      setSrc(undefined);
      return;
    }
    contract
      .tokenURI(id)
      .then((uri: any) => {
        setSrc(uri);
      })
      .catch((e: any) => {
        setSrc(undefined);
        console.error(e);
      });
  }, [id, contract]);

  return <img style={style} src={src} alt={id.toHexString()} />;
}
