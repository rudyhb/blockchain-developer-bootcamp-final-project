import React from "react";
import useSignMessage from "../../hooks/useSignMessage";

interface SignedMessage {
  message: string;
  signature: string;
}

export default function Signer() {
  const sign = useSignMessage();
  const [messageToSign, setMessageToSign] = React.useState("");
  const disabled = !messageToSign;
  const [signedMessage, setSignedMessage] =
    React.useState<SignedMessage | null>(null);

  const signMessage = () => {
    if (!messageToSign || !sign) return;
    sign(messageToSign)
      .catch(e => {
        return `ERROR: ${e.message}`;
      })
      .then(signature => {
        setSignedMessage({
          message: messageToSign,
          signature
        });
      });
  };

  if (!sign) return null;

  return (
    <div
      style={{
        display: "grid",
        gridGap: "1rem",
        gridTemplateColumns: "fit-content",
        margin: "auto",
        padding: "20px"
      }}>
      <input
        type="text"
        value={messageToSign}
        onChange={e => setMessageToSign(e.target.value)}
      />
      <button
        disabled={disabled}
        style={{
          height: "3rem",
          borderRadius: "1rem",
          cursor: "pointer"
        }}
        onClick={signMessage}>
        Sign Message
      </button>
      {signedMessage && (
        <>
          <p>message: {signedMessage.message}</p>
          <p>signature: {signedMessage.signature}</p>
        </>
      )}
    </div>
  );
}
