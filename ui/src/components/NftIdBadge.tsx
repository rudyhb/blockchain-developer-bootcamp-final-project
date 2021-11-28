import React from "react";
import { BigNumber } from "ethers";
import styles from "./NftIdBadge.module.css";
import { Contract } from "@ethersproject/contracts";

const localAddress = 'http://localhost:8081/';
const remoteAddress = 'https://nftid.app/';

export default function NftIdBadge({
  id,
  selected,
  contract
}: {
  id: BigNumber;
  selected: boolean;
  contract: Contract | null;
}) {
  const [src, setSrc] = React.useState<string | undefined>();

  React.useEffect(() => {
    if (!contract)
    {
      setSrc(undefined);
      return;
    }
    contract.tokenURI(id)
      .then((uri: any) => {
        if (localAddress && remoteAddress)
        {
          uri = uri.replace(remoteAddress, localAddress);
        }
        setSrc(uri);
      })
      .catch((e: any) => {
        setSrc(undefined);
        console.error(e);
      })
  }, [id, contract])

  let className = styles.nftIdBadge;
  if (selected) className += ` ${styles.nftIdBadgeActive}`;
  return (
    <div className={className}>
      <img src={src} alt={id.toHexString()}/>
    </div>
  );
}
