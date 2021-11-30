import React from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import Loading from "../shared/Loading";

export default function TransferEth() {
  const { account, library } = useWeb3React();

  const [recipient, setRecipient] = React.useState("");
  const [value, setValue] = React.useState("0");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const btnDisabled = !!(
    error ||
    success ||
    !recipient ||
    !parseFloat(value) ||
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
    let numberValue: BigNumber;
    try {
      numberValue = ethers.utils.parseEther(value);
    } catch (e) {
      setError("invalid quantity: " + value);
      return;
    }
    library
      .getSigner(account)
      .sendTransaction({
        from: account,
        to: recipient,
        value: numberValue
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
      <div className="row space-between">
        <label>Send ETH To: </label>
        <input
          type="text"
          value={recipient}
          onChange={e => setRecip(e.target.value)}
        />
      </div>
      <div className="row space-between">
        <label>Amount: </label>
        <input
          type="number"
          min={0}
          value={value}
          onChange={e => setVal(e.target.value)}
        />
      </div>
      <div className="row space-between">
        <div> </div>
        {!loading && !success && (
          <button
            style={{
              marginTop: "10px"
            }}
            className="btn btn-white white"
            disabled={btnDisabled}
            onClick={sendEth}>
            Send
          </button>
        )}
        {loading && (
          <div className="btn btn-clear">
            <Loading loadingText={"sending"} />
          </div>
        )}
        {success && <div className="btn btn-clear">Sent!</div>}
      </div>
    </>
  );
}
