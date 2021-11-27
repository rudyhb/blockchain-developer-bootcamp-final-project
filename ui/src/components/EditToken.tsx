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
      <FaTimesCircle />
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
      <h4>Add role</h4>
      <label>address</label>
      <input
        type="text"
        value={address}
        onChange={e => setAddress(e.target.value)}
      />
      <label>role</label>
      <input type="text" value={role} onChange={e => setRole(e.target.value)} />
      {!loading && (
        <button disabled={submitDisabled} onClick={onClickAddRole}>
          Add
        </button>
      )}
      {loading && <Loading loadingText="adding role..." />}
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
      <h4>Transfer NFT ID</h4>
      <label>to</label>
      <input
        type="text"
        value={address}
        onChange={e => setAddress(e.target.value)}
      />
      {!loading && (
        <button disabled={submitDisabled} onClick={onClickSubmit}>
          Transfer
        </button>
      )}
      {loading && <Loading loadingText="transferring..." />}
    </>
  );
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

  const error = combineNonEmpty([ownerError, roleMapError, changeRoleError]);
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
    } catch (e: any) {
      setChangeRoleError(`Error transferring NFT ID: ${e.message}`);
      console.error(e);
    }
    window.location.reload();
  };

  const isOwner = !!(owner && owner === account);

  if (!nftId) return null;
  return (
    <div>
      <h3>Token Details</h3>
      {error && <p>Error: {error}</p>}
      <span>
        owner: <CopyableShortAccount account={owner} />
        {isOwner ? " (me)" : ""}
      </span>
      <h4>Roles</h4>
      {!roleMap && <Loading />}
      {roleMap &&
        Object.keys(roleMap).map(address => (
          <div key={address}>
            <CopyableShortAccount account={address} />: {roleMap[address]}{" "}
            {address === account ? " (me)" : ""}
            <RemoveRoleBtn
              isOwner={isOwner}
              owner={owner}
              address={address}
              removeRole={removeRole}
            />
          </div>
        ))}
      {roleMap && isOwner && <AddRoleBtn addRole={addRole} />}
      {isOwner && <TransferNftBtn transfer={transfer} />}
    </div>
  );
}
