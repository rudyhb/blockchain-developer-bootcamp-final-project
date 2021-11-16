import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

export default function useSignMessage() {
  const context = useWeb3React<Web3Provider>();
  const { library, account } = context;

  if (!library || !account)
    return null;

  const signer = library.getSigner(account);

  return signer.signMessage.bind(signer);
}
