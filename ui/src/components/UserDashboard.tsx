import React from "react";
import useSignIn from "../hooks/useSignIn";
import { BigNumber } from "ethers";
import useUserData from "../hooks/useUserData";
import Divider from "./shared/Divider";
import { useWeb3React } from "@web3-react/core";

function EditStatus({ setStatus }: { setStatus: React.Dispatch<string> }) {
  const [changingStatus, setChangingStatus] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState("");
  const set = () => {
    if (!newStatus) return;
    setStatus(newStatus);
    setNewStatus("");
    setChangingStatus(false);
  };
  return (
    <div>
      {changingStatus ? (
        <>
          <input
            type="text"
            onChange={e => setNewStatus(e.target.value)}
            value={newStatus}
          />
          <button disabled={!newStatus} onClick={set}>
            change
          </button>
          <button onClick={() => setChangingStatus(false)}>cancel</button>
        </>
      ) : (
        <button onClick={() => setChangingStatus(true)}>change status</button>
      )}
    </div>
  );
}

export default function UserDashboard({ nftId }: { nftId?: BigNumber }) {
  const {
    signedIn,
    signIn,
    signOut,
    token,
    error: errorSigningIn,
    disabled: disabledSigningIn
  } = useSignIn({ nftId });
  const {
    userData,
    error: errorUserData,
    disabled: disabledUserData,
    setStatus
  } = useUserData(token);
  const {account} = useWeb3React();

  React.useEffect(() => {
    signOut();
  }, [nftId, account]);

  return (
    <div
      style={{
        display: "grid",
        gridGap: "1rem",
        gridTemplateColumns: "fit-content",
        margin: "auto",
        padding: "20px"
      }}>
      {!nftId && <p>click on an NFT ID below (or mint a new one)</p>}

      {errorSigningIn && <p>Error signing in: {errorSigningIn}</p>}

      {!signedIn && (
        <button
          disabled={disabledSigningIn}
          style={{
            height: "3rem",
            borderRadius: "1rem",
            cursor: "pointer"
          }}
          onClick={signIn}>
          Sign In with NFT {nftId?.toHexString()}
        </button>
      )}

      {signedIn && <p>Signed in with {nftId?.toHexString()}</p>}

      {(signedIn && (userData || errorUserData)) && (
        <>
          <Divider />

          {errorUserData && <p>Error retrieving user data: {errorUserData}</p>}

          {userData && (
            <>
              <h3>User Data</h3>
              <p>NFT ID: {userData.nftId}</p>
              <p>Role: {userData.role}</p>
              <p>Status: {userData.status}</p>
              {!disabledUserData && <EditStatus setStatus={setStatus} />}
            </>
          )}
        </>
      )}
    </div>
  );
}
