import React from "react";

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

export default function Web3Button() {
  const context = useWeb3React<Web3Provider>();
  const { connector, chainId, activate, deactivate, active, error } = context;

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
      <div
        style={{
          display: "grid",
          gridGap: "1rem",
          gridTemplateColumns: "1fr 1fr",
          maxWidth: "20rem",
          margin: "auto"
        }}>
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

            return (
              <button
                style={{
                  height: "3rem",
                  borderRadius: "1rem",
                  borderColor: activating
                    ? "orange"
                    : connected
                    ? "green"
                    : "unset",
                  paddingLeft: connected ? "20px" : "",
                  cursor: disabled ? "unset" : "pointer",
                  position: "relative"
                }}
                disabled={disabled}
                key={name}
                onClick={() => {
                  setActivatingConnector(currentConnector);
                  activate(connectorsByName[name]);
                }}>
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    color: "black",
                    margin: "0 0 0 1rem"
                  }}>
                  {activating && (
                    <Spinner
                      color={"black"}
                      style={{ height: "25%", marginLeft: "-1rem" }}
                    />
                  )}
                  {connected && (
                    <span role="img" aria-label="check">
                      ✅
                    </span>
                  )}
                </div>
                {display}
              </button>
            );
          })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
        {(active || error) && (
          <button
            style={{
              height: "3rem",
              marginTop: "2rem",
              borderRadius: "1rem",
              borderColor: "red",
              cursor: "pointer"
            }}
            onClick={() => {
              deactivate();
            }}>
            Deactivate
          </button>
        )}

        {!!error && (
          <h4 style={{ marginTop: "1rem", marginBottom: "0" }}>
            {getErrorMessage(error)}
          </h4>
        )}
      </div>
    </>
  );
}
