import React from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import Loading from "../shared/Loading";

const ethToWei = (ethVal: number) => {
  const eth = BigNumber.from(ethVal);
  return eth.mul(ethers.constants.WeiPerEther);
};

export default function TransferEth() {
  const { account, library } = useWeb3React();

  const [recipient, setRecipient] = React.useState("");
  const [value, setValue] = React.useState("0");
  const numberValue = parseFloat(value);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const btnDisabled = !!(
    error ||
    success ||
    !recipient ||
    !numberValue ||
    loading
  );

  const setVal = (val: string) => {
    setValue(val);
    setError(null);
  };

  const setRecip = (recip: string) => {
    setRecipient(recip);
    setError(null);
  };

  React.useEffect(() => {
    if (!success) return;
    const reset = () => {
      setRecipient("");
      setValue("0");
      setError(null);
      setSuccess(false);
    };
    const handle = window.setTimeout(() => {
      reset();
    }, 5000);

    return () => {
      window.clearTimeout(handle);
    };
  }, [success]);

  const sendEth = () => {
    setLoading(true);
    library
      .getSigner(account)
      .sendTransaction({
        from: account,
        to: recipient,
        value: ethToWei(numberValue)
      })
      .then(() => {
        setLoading(false);
        setSuccess(true);
      })
      .catch((e: any) => {
        setLoading(false);
        setError(`Error with transaction: ${e.message}`);
      });
  };

  return (
    <>
      <p>Send ETH</p>
      <label>To: </label>
      <input
        type="text"
        value={recipient}
        onChange={e => setRecip(e.target.value)}
      />
      <label>Amount: </label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={e => setVal(e.target.value)}
      />
      <button disabled={btnDisabled} onClick={sendEth}>
        Send
      </button>
      {loading && <Loading loadingText={"sending"} />}
      {success && <p>Sent!</p>}
    </>
  );
}
