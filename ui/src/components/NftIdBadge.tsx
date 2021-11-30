import React from "react";
import { BigNumber } from "ethers";
import styles from "./NftIdBadge.module.css";
import { Contract } from "@ethersproject/contracts";
import NftImg from "./NftImg";

export default function NftIdBadge({
  id,
  selected,
  contract
}: {
  id: BigNumber;
  selected: boolean;
  contract: Contract | null;
}) {
  let className = styles.nftIdBadge;
  if (selected) className += ` border-violet ${styles.nftIdBadgeActive}`;
  return (
    <div className={className}>
      <NftImg id={id} contract={contract} />
    </div>
  );
}
