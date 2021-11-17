import React from "react";
import styles from "./NavBar.module.css";
import Web3Button from "./web3/Web3Button";
import Web3Status from "./web3/Web3Status";
import { FaInfo } from "react-icons/fa";
import Divider from "./shared/Divider";

function ToggleDetailsBtn({
  enabled,
  onClick
}: {
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <div onClick={onClick} className={styles.toggleDetailsBtn}>
      <FaInfo />
    </div>
  );
}

export default function NavBar() {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div className={styles.navbar}>
      <Web3Button />
      <ToggleDetailsBtn
        enabled={showDetails}
        onClick={() => {
          setShowDetails(d => !d);
        }}
      />
      {showDetails && (
        <>
          <Divider/>
          <Web3Status />
        </>
      )}
      <Divider/>
    </div>
  );
}
