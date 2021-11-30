import React from "react";

import { useWeb3React } from "@web3-react/core";
import { formatEther } from "@ethersproject/units";
import TransferEth from "./TransferEth";
import CopyableShortAccount from "./CopyableShortAccount";

function Account() {
  const { account } = useWeb3React();

  return (
    <div className='row space-between'>
      <span>Account</span>
      <span>
        {account === null ? "-" : <CopyableShortAccount account={account} />}
      </span>
    </div>
  );
}

function Balance() {
  const { account, library, chainId } = useWeb3React();

  const [balance, setBalance] = React.useState<any>();
  React.useEffect((): any => {
    if (!!account && !!library) {
      let stale = false;

      library
        .getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            setBalance(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null);
          }
        });

      return () => {
        stale = true;
        setBalance(undefined);
      };
    }
  }, [account, library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <div className='row space-between'>
      <span>Balance</span>
      <span>
        {balance === null ? "Error" : balance ? `Ξ${formatEther(balance).slice(0, 12)}` : ""}
      </span>
    </div>
  );
}

export default function Web3Status() {
  return (
    <div className='background-violet white intrusive container'>
      <div className='card h3 center'>
        <Account />
        <Balance />
        <TransferEth />
      </div>
    </div>
  );
}
