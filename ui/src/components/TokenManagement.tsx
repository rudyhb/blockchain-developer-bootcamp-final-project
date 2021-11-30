import React from "react";
import useContract from "../hooks/useContract";
import Loading from "./shared/Loading";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import NftIdBadge from "./NftIdBadge";
import EditToken from "./EditToken";

const getNftIdFromEvent = (event: any, offset: number) => {
  if (event && event.args && event.args[offset])
    return event.args[offset] as BigNumber;
  throw new Error("invalid format from event");
};

export default function TokenManagement({
  setNftId
}: {
  setNftId: React.Dispatch<BigNumber | null>;
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
  const active = web3.active;
  const [tokensFound, setTokensFound] = React.useState<BigNumber[] | null>(
    null
  );
  const [myTokens, setMyTokens] = React.useState<BigNumber[] | null>(null);
  const [selectedToken, setSelectedToken] = React.useState<BigNumber | null>(
    null
  );
  const [myTokensSymbol, setMyTokensSymbol] = React.useState(Symbol());

  const submitDisabled = !contractWithSigner;
  const [newUriLoading, setNewUriLoading] = React.useState(false);

  const onClickMint: React.FormEventHandler = e => {
    e.preventDefault();
    if (submitDisabled) return;
    setNewUriLoading(true);
    contractWithSigner["safeMint()"]()
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
    if (!contract || !myAddress || !active) return;

    let stop = false;

    const filterTransferred = contract.filters.Transfer(null, myAddress, null);
    const filterSetRole = contract.filters.SetRole(myAddress, null);

    Promise.all([
      contract.queryFilter(filterTransferred),
      contract.queryFilter(filterSetRole)
    ])
      .then(([transferredEvents, setRoleEvents]) => {
        if (stop) return;
        const found: { [key: string]: BigNumber } = {};
        transferredEvents
          .map(e => getNftIdFromEvent(e, 2))
          .concat(setRoleEvents.map(e => getNftIdFromEvent(e, 1)))
          .forEach(token => {
            found[token.toHexString()] = token;
          });
        setTokensFound(
          Object.keys(found)
            .sort()
            .map(key => found[key])
        );
      })
      .catch(e => {
        if (stop) return;
        console.error(e);
      });

    return () => {
      stop = true;
    };
  }, [contract, myTokensSymbol, myAddress, active]);

  React.useEffect(() => {
    if (!contract || !myAddress || !tokensFound) return;

    interface TokenHoldingDetails {
      token: BigNumber;
      isMyToken: boolean;
    }

    const stillHaveToken = async (
      token: BigNumber
    ): Promise<TokenHoldingDetails> => {
      const stillHave = async (token: BigNumber): Promise<boolean> => {
        const role = await contract.getRoleFor(myAddress, token);
        return !!role;
      };
      return {
        token,
        isMyToken: await stillHave(token)
      };
    };

    let stop = false;

    Promise.all(tokensFound.map(token => stillHaveToken(token)))
      .then(details => {
        if (!stop)
          setMyTokens(
            details
              .filter(detail => detail.isMyToken)
              .map(detail => detail.token)
          );
      })
      .catch(e => {
        if (stop) return;
        console.error(e);
      });

    return () => {
      stop = true;
    };
  }, [contract, myAddress, tokensFound]);

  if (!active) return null;

  if (!contract) return <Loading />;

  const onClickNftToken = (token: BigNumber) => {
    const tk =
      selectedToken && selectedToken.toHexString() === token.toHexString()
        ? null
        : token;
    setSelectedToken(tk);
    setNftId(tk);
  };

  const firstDivStyle: React.CSSProperties = selectedToken
    ? {
        maxWidth: "50%"
      }
    : {};

  return (
    <div className="container row space-between intrusive">
      <div style={firstDivStyle}>
        <h2>My NTF IDs:</h2>
        {myTokens === null ? (
          <Loading />
        ) : (
          <ul className="row">
            {myTokens.map(token => (
              <li
                key={token.toHexString()}
                style={{ cursor: "pointer" }}
                onClick={() => onClickNftToken(token)}>
                <NftIdBadge
                  contract={contract}
                  id={token}
                  selected={
                    token.toHexString() === selectedToken?.toHexString()
                  }
                />
              </li>
            ))}
          </ul>
        )}
        <div>
          {newUriLoading ? (
            <Loading />
          ) : (
            <div>
              <button
                className="btn btn-violet violet"
                type="submit"
                disabled={submitDisabled}
                onClick={onClickMint}>
                Mint a new NFT ID
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          flexGrow: 0.5
        }}>
        <EditToken nftId={selectedToken} />
      </div>
    </div>
  );
}
