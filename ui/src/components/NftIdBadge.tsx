import React from "react";
import { BigNumber } from "ethers";
import styles from "./NftIdBadge.module.css";

export default function NftIdBadge({
  id,
  selected
}: {
  id: BigNumber;
  selected: boolean;
}) {
  let className = styles.nftIdBadge;
  if (selected) className += ` ${styles.nftIdBadgeActive}`;
  return (
    <div className={className}>
      <p>{id.toHexString()}</p>
    </div>
  );
}
