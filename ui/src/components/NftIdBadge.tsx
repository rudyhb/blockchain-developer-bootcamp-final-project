import React from "react";
import { BigNumber } from "ethers";
import styles from './NftIdBadge.module.css';

export default function NftIdBadge({ id }: { id: BigNumber }) {
  return <div className={styles.nftIdBadge}>
    <p>{id.toHexString()}</p>
  </div>;
}
