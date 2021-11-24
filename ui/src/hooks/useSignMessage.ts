import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

export default function useSignMessage() {
  const context = useWeb3React<Web3Provider>();
  const { library, account } = context;

  if (!library || !account)
    return null;

  return async (message: any) => {
    const params = [account, JSON.stringify(message)];
    const method = 'eth_signTypedData_v4';

    return await library.send(method, params);
  }
}
