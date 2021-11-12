import React from "react";
import { Web3Options } from "../../interfaces/Web3";

export default function RpcButton({
  web3Options,
  setWeb3Options
}: {
  web3Options: Web3Options;
  setWeb3Options: React.Dispatch<React.SetStateAction<Web3Options>>;
}) {
  const { url } = web3Options;

  return (
    <div>
      <p>Connected to RPC at {url}</p>
    </div>
  );
}
