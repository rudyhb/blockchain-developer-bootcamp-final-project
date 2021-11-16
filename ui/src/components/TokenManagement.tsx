import React from "react";
import useContract from "../hooks/useContract";
import Loading from "./shared/Loading";
import { useWeb3React } from "@web3-react/core";

export default function TokenManagement() {
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
  const [myTokens, setMyTokens] = React.useState<string[] | null>(null);
  const [myTokensSymbol, setMyTokensSymbol] = React.useState(Symbol());

  const submitDisabled = !contractWithSigner;
  const [newUri, setNewUri] = React.useState("");
  const [newUriLoading, setNewUriLoading] = React.useState(false);
  const onNewUriChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setNewUri(e.target.value);
  };

  const onNewUriSubmit: React.FormEventHandler = e => {
    e.preventDefault();
    if (submitDisabled) return;
    console.log("submitting new nft with uri:", newUri);
    setNewUriLoading(true);
    contractWithSigner
      .mint(newUri)
      .then(() => {
        setNewUriLoading(false);
        setMyTokensSymbol(Symbol());
        setNewUri("");
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
          mintedEvents.concat(transferredEvents).map(e => JSON.stringify(e))
        );
      })
      .catch(e => {
        if (stop) return;
        console.error(e);
      });

    return () => {
      stop = true;
    };
  }, [contract?.address, myTokensSymbol, myAddress]);

  if (!contract) return <Loading />;

  return (
    <div>
      <div>
        <h2>My NTF IDs:</h2>
        {myTokens === null ? (
          <Loading />
        ) : (
          <ul>
            {myTokens.map(token => (
              <li key={token}>
                <p>{token}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h2>Mint:</h2>
        {newUriLoading ? (
          <Loading />
        ) : (
          <div>
            <label>uri: </label>
            <input type="text" value={newUri} onChange={onNewUriChange} />
            <button
              type="submit"
              disabled={submitDisabled}
              onClick={onNewUriSubmit}>
              Mint!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
