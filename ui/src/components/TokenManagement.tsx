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
    contractWithSigner
      .mint()
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
    const filterSetRole = contract.filters.SetRole(myAddress, null);

    Promise.all([
      contract.queryFilter(filterMinted),
      contract.queryFilter(filterTransferred),
      contract.queryFilter(filterSetRole)
    ])
      .then(([mintedEvents, transferredEvents, setRoleEvents]) => {
        if (stop) return;
        const found: { [key: string]: BigNumber } = {};
        mintedEvents
          .map(e => getNftIdFromEvent(e, 1))
          .concat(transferredEvents.map(e => getNftIdFromEvent(e, 2)))
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
  }, [contract, myTokensSymbol, myAddress]);

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
        const owner = await contract.ownerOf(token);
        if (myAddress === owner) return true;
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

  if (!contract) return <Loading />;

  const onClickNftToken = (token: BigNumber) => {
    setSelectedToken(token);
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
                  selected={
                    token.toHexString() === selectedToken?.toHexString()
                  }
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
              onClick={onClickMint}>
              Mint a new NFT ID
            </button>
          </div>
        )}
      </div>
      <div>
        <EditToken nftId={selectedToken} />
      </div>
    </div>
  );
}
