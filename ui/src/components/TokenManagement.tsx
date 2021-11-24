import React from "react";
import useContract from "../hooks/useContract";
import Loading from "./shared/Loading";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import NftIdBadge from "./NftIdBadge";

const getNftIdFromEvent = (event: any) => {
  if (event && event.args && event.args[1]) return event.args[1] as BigNumber;
  throw new Error("invalid format from event");
};

export default function TokenManagement({
  setNftId
}: {
  setNftId: React.Dispatch<BigNumber>;
}) {
  const contract = useContract();
  const web3 = useWeb3React();
  // const contractWithSigner = React.useMemo(
  //   () =>
  //     (web3.provider?.signer && contract?.connect(web3.provider?.signer)) ||
  //     null,
  //   [contract, web3.provider?.signer]
  // );
  const contractWithSigner = contract;

  const myAddress = web3.account;
  const [myTokens, setMyTokens] = React.useState<BigNumber[] | null>(null);
  const [selectedToken, setSelectedToken] = React.useState<string | null>(null);
  const [myTokensSymbol, setMyTokensSymbol] = React.useState(Symbol());

  const submitDisabled = !contractWithSigner;
  const [newUriLoading, setNewUriLoading] = React.useState(false);

  const onNewUriSubmit: React.FormEventHandler = e => {
    e.preventDefault();
    if (submitDisabled) return;
    setNewUriLoading(true);
    contractWithSigner
      .mint("nftid")
      .then((response: any) => {
        if (response && typeof response.wait === "function")
          return response.wait(1);
        return null;
      })
      .then(() => {
        setNewUriLoading(false);
        setMyTokensSymbol(Symbol());
      })
      .catch((e: unknown) => {
        setNewUriLoading(false);
        console.error(e);
      });
  };

  React.useEffect(() => {
    if (!contract || !myAddress) return;

    let stop = false;

    const filterMinted = contract.filters.Minted(myAddress, null);
    const filterTransferred = contract.filters.Transfer(null, myAddress, null);

    Promise.all([
      contract.queryFilter(filterMinted),
      contract.queryFilter(filterTransferred)
    ])
      .then(([mintedEvents, transferredEvents]) => {
        if (stop) return;
        setMyTokens(
          mintedEvents.concat(transferredEvents).map(e => getNftIdFromEvent(e))
        );
      })
      .catch(e => {
        if (stop) return;
        console.error(e);
      });

    return () => {
      stop = true;
    };
  }, [contract, myTokensSymbol, myAddress]);

  if (!contract) return <Loading />;

  const onClickNftToken = (token: BigNumber) => {
    setSelectedToken(token.toHexString());
    setNftId(token);
  };

  return (
    <div
      style={{
        margin: "20px"
      }}>
      <div>
        <h2>My NTF IDs:</h2>
        {myTokens === null ? (
          <Loading />
        ) : (
          <ul>
            {myTokens.map(token => (
              <li
                key={token.toHexString()}
                style={{ cursor: "pointer" }}
                onClick={() => onClickNftToken(token)}>
                <NftIdBadge
                  id={token}
                  selected={token.toHexString() === selectedToken}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        {newUriLoading ? (
          <Loading />
        ) : (
          <div>
            <button
              type="submit"
              disabled={submitDisabled}
              onClick={onNewUriSubmit}>
              Mint a new NFT ID
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
