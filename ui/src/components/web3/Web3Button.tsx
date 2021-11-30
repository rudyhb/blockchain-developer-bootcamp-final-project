import React from "react";

import {FaCheckCircle, FaLongArrowAltRight, FaWallet } from "react-icons/fa";

import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from "@web3-react/injected-connector";
import { Web3Provider } from "@ethersproject/providers";

import {
  useEagerConnect,
  useInactiveListener
} from "../../hooks/web3-react-hooks";
import { injected, network } from "../../connectors/connectors";
import { Spinner } from "../shared/Spinner";
import useWeb3Info from "../../hooks/useWeb3Info";
import CopyableShortAccount from "./CopyableShortAccount";

enum ConnectorNames {
  Injected = "Metamask",
  Network = "Local RPC"
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.Network]: network
};

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
}

export default function Web3Button({
  onClickShowWalletInfo
                                   } : {onClickShowWalletInfo: () => void}) {
  const context = useWeb3React<Web3Provider>();
  const { connector, activate, deactivate, active, error, account } = context;

  const web3Info = useWeb3Info();

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  const validConnectors: ConnectorNames[] = web3Info?.localContractAddress
    ? (Object.keys(connectorsByName) as ConnectorNames[])
    : (Object.keys(connectorsByName).filter(
        name => name !== ConnectorNames.Network
      ) as ConnectorNames[]);

  return (
    <>
      <nav className='reverse-row'>
        <ul className='reverse-row space-between align-right'>
          {(active || error) && (<li className='fill-up'>
            <button
              className='btn btn-red fill-up'
              onClick={() => {
                deactivate();
              }}>
              Sign out
            </button>
          </li>)}
        {validConnectors
          .filter(name => connectorsByName[name])
          .map(name => {
            const currentConnector = connectorsByName[name];
            const activating = currentConnector === activatingConnector;
            const connected = currentConnector === connector;
            const disabled =
              !triedEager || !!activatingConnector || connected || !!error;
            const display = connected
              ? `${name} connected`
              : `connect to ${name}`;
            const color = connected ? 'green' : activating ? 'yellow' : 'violet';

            return (
              <li key={name} className='fill-up'>
                {connected && (<div className={`btn btn-${color} fill-up cursorNormal`}>
                  <FaCheckCircle className='green' size={30} style={{
                    marginRight: "10px"
                  }}/>
                  {account ? (<CopyableShortAccount account={account}/>) : 'Connected' }
                </div>)}
                {!connected && (
                  <button
                    className={`btn btn-${color} fill-up`}
                    disabled={disabled}
                    onClick={() => {
                      setActivatingConnector(currentConnector);
                      activate(connectorsByName[name]);
                    }}>
                    {activating && (
                      <Spinner
                        color={"black"}
                        style={{ height: "75%" }}
                      />
                    )}
                    connect to {name}
                  </button>
                )}
              </li>
            );
          })}
          {active && (
            <li className='fill-up'>
              <button className='btn btn-violet fill-up' onClick={onClickShowWalletInfo}>
                <FaWallet className='violet' size={20} style={{marginRight: "10px"}}/>
                wallet info
              </button>
            </li>
          )}
          {!!error && (
            <li className='fill-up'>
              <div className='btn btn-clear fill-up cursorNormal' style={{
                maxWidth: "2000px"
              }}>
                {getErrorMessage(error)}
              </div>
            </li>
          )}
          {!error && !active && (<li className='fill-up'>
            <div className='btn btn-clear fill-up cursorNormal' style={{
              maxWidth: "500px"
            }}>
              connect your wallet to get started!<FaLongArrowAltRight size={25} style={{
                marginLeft: "10px"
            }}/>
            </div>
          </li>)}
        </ul>
      </nav>
    </>
  );
}
