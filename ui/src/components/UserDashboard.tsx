import React from "react";
import useSignIn from "../hooks/useSignIn";
import { BigNumber } from "ethers";
import useUserData from "../hooks/useUserData";
import Divider from "./shared/Divider";
import { useWeb3React } from "@web3-react/core";
import NftImg from "./NftImg";
import useContract from "../hooks/useContract";
import LeftAndRight from "./shared/LeftAndRight";

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
    <div
      style={{
        marginTop: "10px"
      }}>
      {changingStatus ? (
        <>
          <LeftAndRight
            left=""
            right={
              <input
                type="text"
                onChange={e => setNewStatus(e.target.value)}
                value={newStatus}
              />
            }
          />
          <LeftAndRight
            style={{
              marginTop: "5px"
            }}
            left={
              <button
                className="btn btn-white white"
                disabled={!newStatus}
                onClick={set}>
                change
              </button>
            }
            right={
              <button
                className="btn btn-white white"
                onClick={() => setChangingStatus(false)}>
                cancel
              </button>
            }
          />
        </>
      ) : (
        <LeftAndRight
          left=""
          right={
            <button
              className="btn btn-white white"
              onClick={() => setChangingStatus(true)}>
              change data
            </button>
          }
        />
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
  const { account, chainId } = useWeb3React();
  const contract = useContract();

  React.useEffect(() => {
    signOut();
  }, [nftId, account, chainId]);

  if (!account) return null;

  return (
    <>
      <Divider />
      <div
        className="container"
        style={{
          minHeight: "500px"
        }}>
        <div className="row space-between">
          <div>
            <h2>Try out your NFT ID!</h2>
            {!nftId && (
              <p>
                click on an NFT ID above (or mint a new one) to sign in with it
              </p>
            )}

            {errorSigningIn && <p>Error signing in: {errorSigningIn}</p>}

            {!signedIn && nftId && (
              <button
                className="btn btn-violet violet"
                disabled={disabledSigningIn}
                onClick={signIn}>
                Sign In with{" "}
                <NftImg
                  style={{
                    width: "15px",
                    marginLeft: "5px"
                  }}
                  id={nftId}
                  contract={contract}
                />
              </button>
            )}

            {signedIn && nftId && (
              <>
                <p>
                  Signed in with{" "}
                  <NftImg
                    style={{
                      width: "15px",
                      marginLeft: "5px"
                    }}
                    id={nftId}
                    contract={contract}
                  />{" "}
                  {nftId.toHexString()}
                </p>
                <button
                  className="btn btn-violet violet"
                  style={{
                    height: "3rem",
                    borderRadius: "1rem",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    signOut();
                  }}>
                  Sign Out
                </button>
              </>
            )}
          </div>
          <div>
            {signedIn && (userData || errorUserData) && (
              <div
                className="container white background-violet margin-provider-50"
                style={{
                  borderRadius: "10px",
                  lineHeight: "1.75em"
                }}>
                <h2>Account Dashboard</h2>
                {errorUserData && (
                  <div
                    style={{
                      marginBottom: "30px"
                    }}>
                    <LeftAndRight right="" left="Error retrieving user data" />
                    <LeftAndRight right="" left={errorUserData} />
                  </div>
                )}

                {userData && (
                  <>
                    <LeftAndRight left="NFT ID" right={userData.nftId} />
                    <LeftAndRight left="Role" right={userData.role} />
                    <LeftAndRight left="Stored Data" right={userData.status} />
                    {!disabledUserData && <EditStatus setStatus={setStatus} />}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
