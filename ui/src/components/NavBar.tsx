import React from "react";
import styles from "./NavBar.module.css";
import Web3Button from "./web3/Web3Button";
import Web3Status from "./web3/Web3Status";
import Divider from "./shared/Divider";

export default function NavBar() {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div className={styles.navbar}>
      <div style={{
        maxWidth: "300px",
        fontSize: "xxx-large",
        left: "20px",
        position: "absolute"
      }} className='violet btn btn-clear cursorNormal'>
        NFT ID
      </div>
      <Web3Button onClickShowWalletInfo={() => {
        setShowDetails(d => !d);
      }}/>
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
