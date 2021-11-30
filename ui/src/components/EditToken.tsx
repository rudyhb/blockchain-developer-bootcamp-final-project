import React from "react";
import { BigNumber } from "ethers";
import useContract from "../hooks/useContract";
import { useWeb3React } from "@web3-react/core";
import CopyableShortAccount from "./web3/CopyableShortAccount";
import useNftOwner from "../hooks/useNftOwner";
import { combineNonEmpty } from "../utils/utils";
import useNftRoleMap from "../hooks/useNftRoleMap";
import Loading from "./shared/Loading";
import { FaTimesCircle } from "react-icons/fa";
import OnClickSpan from "./shared/OnClickSpan";

function RemoveRoleBtn({
  isOwner,
  owner,
  address,
  removeRole
}: {
  isOwner: boolean;
  owner?: string | null;
  address?: string | null;
  removeRole: (address: string) => Promise<void>;
}) {
  if (!address || !isOwner || owner === address) return null;
  return (
    <OnClickSpan
      textBeforeClick="remove role"
      textOnClick="removed!"
      textOnClicking="removing..."
      onClick={() => removeRole(address)}>
      <FaTimesCircle style={{
        marginLeft: "5px"
      }} />
    </OnClickSpan>
  );
}

function AddRoleBtn({
  addRole
}: {
  addRole: (address: string, role: string) => Promise<void>;
}) {
  const [address, setAddress] = React.useState("");
  const [role, setRole] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const submitDisabled = !address || !role || address.slice(0, 2) !== "0x";

  const onClickAddRole: React.FormEventHandler = e => {
    e.preventDefault();
    setLoading(true);
    addRole(address, role)
      .catch(() => {})
      .then(() => {
        setAddress("");
        setRole("");
        setLoading(false);
      });
  };

  return (
    <>
      <h2>Add role</h2>
      <LeftAndRight left="address" right={<input
        type="text"
        value={address}
        onChange={e => setAddress(e.target.value)}
      />}/>
      <LeftAndRight left='role' right={<input type="text" value={role} onChange={e => setRole(e.target.value)} />}/>
      {!loading && (
        <LeftAndRight right={<button
          style={{
            marginTop: "5px"
          }}
          className='btn btn-white white'
          disabled={submitDisabled} onClick={onClickAddRole}>
          Add
        </button>} left=''/>
      )}
      {loading && <LeftAndRight left={<Loading loadingText='adding role'/>} right=''/>}
    </>
  );
}

function TransferNftBtn({
  transfer
}: {
  transfer: (address: string) => Promise<void>;
}) {
  const [address, setAddress] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const submitDisabled = !address || address.slice(0, 2) !== "0x";

  const onClickSubmit: React.FormEventHandler = e => {
    e.preventDefault();
    setLoading(true);
    transfer(address)
      .catch(() => {})
      .then(() => {
        setAddress("");
        setLoading(false);
      });
  };

  return (
    <>
      <h2>Transfer NFT ID</h2>
      <LeftAndRight left='to' right={<input
        type="text"
        value={address}
        onChange={e => setAddress(e.target.value)}
      />}/>
      {!loading && (
        <LeftAndRight right={<button
          style={{
            marginTop: "5px"
          }}
          className='btn btn-white white'
          disabled={submitDisabled} onClick={onClickSubmit}>
          Transfer
        </button>} left=''/>
      )}
      {loading && <LeftAndRight left={<Loading loadingText='transferring'/>} right=''/>}
    </>
  );
}

function LeftAndRight({
                        left,
                        right
                      } : {
  left: React.ReactNode,
  right: React.ReactNode
}) {
  return (
    <div className='row space-between'>
      <div style={{
        marginRight: "5px"
      }}>{left}</div>
      <div className='strong'>{right}</div>
    </div>
  )
}

export default function EditToken({ nftId }: { nftId: BigNumber | null }) {
  const contract = useContract();
  const web3 = useWeb3React();

  const account = web3.account;

  const [ownerError, owner] = useNftOwner({ nftId, contract });
  const [roleMapError, roleMap, updateRoleMap] = useNftRoleMap({
    nftId,
    contract
  });
  const [changeRoleError, setChangeRoleError] = React.useState<string | null>(
    null
  );

  // const error = combineNonEmpty([ownerError, roleMapError, changeRoleError]);
  const error = (ownerError || roleMapError || changeRoleError) && "Please see the console for more details.";
  const removeRole = async (address: string) => {
    if (!contract || !nftId) return;
    setChangeRoleError(null);
    try {
      const response = await contract.removeRole(nftId, address);
      if (response && typeof response.wait === "function")
        await response.wait(1);
    } catch (e: any) {
      setChangeRoleError(`Error removing role: ${e.message}`);
      console.error(e);
    }
    updateRoleMap();
  };
  const addRole = async (address: string, role: string) => {
    if (!contract || !nftId) return;
    setChangeRoleError(null);
    try {
      const response = await contract.setRole(nftId, address, role);
      if (response && typeof response.wait === "function")
        await response.wait(1);
    } catch (e: any) {
      setChangeRoleError(`Error adding role: ${e.message}`);
      console.error(e);
    }
    updateRoleMap();
  };
  const transfer = async (address: string) => {
    if (!contract || !nftId) return;
    setChangeRoleError(null);
    try {
      const response = await contract.transfer(address, nftId);
      if (response && typeof response.wait === "function")
        await response.wait(1);
      window.location.reload();
    } catch (e: any) {
      setChangeRoleError(`Error transferring NFT ID: ${e.message}`);
      console.error(e);
    }
  };

  const isOwner = !!(owner && owner === account);

  if (!nftId) return null;
  return (
    <div
      className='container white background-violet'

      style={{
        borderRadius: "10px",
        lineHeight: "1.75em"
    }}>
      <h2>Token Details</h2>
      {error && (
        <div style={{
          marginBottom: "30px"
        }}>
          <LeftAndRight right="" left="An error occurred"/>
          <LeftAndRight right="" left={error}/>
        </div>
      )}
      <LeftAndRight left="NFT ID:" right={nftId.toHexString()}/>
      <LeftAndRight left="owner" right={<>
        <CopyableShortAccount account={owner} />
        {isOwner ? " (me)" : ""}
      </>}/>
      <h2>Roles</h2>
      {!roleMap && <LeftAndRight left={<Loading/>} right={""}/> }
      {roleMap &&
        Object.keys(roleMap).map(address => (
          <div key={address}>
            <LeftAndRight left={<><CopyableShortAccount account={address} />:</>} right={<>
              {`${roleMap[address]}${address === account ? " (me)" : ""}`}
              <RemoveRoleBtn
                isOwner={isOwner}
                owner={owner}
                address={address}
                removeRole={removeRole}
              />
            </>}/>
          </div>
        ))}
      {roleMap && isOwner && <AddRoleBtn addRole={addRole} />}
      {isOwner && <TransferNftBtn transfer={transfer} />}
    </div>
  );
}

