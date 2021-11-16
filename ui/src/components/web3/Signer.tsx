import React from "react";
import useSignMessage from "../../hooks/useSignMessage";

export default function Signer() {
  const sign = useSignMessage();

  if (!sign) return null;

  return (
    <div
      style={{
        display: "grid",
        gridGap: "1rem",
        gridTemplateColumns: "fit-content",
        maxWidth: "20rem",
        margin: "auto"
      }}>
      <button
        style={{
          height: "3rem",
          borderRadius: "1rem",
          cursor: "pointer"
        }}
        onClick={() => {
          sign("👋")
            .then((signature: any) => {
              window.alert(`Success!\n\n${signature}`);
            })
            .catch((error: any) => {
              window.alert(
                "Failure!" +
                (error && error.message ? `\n\n${error.message}` : "")
              );
            });
        }}>
        Sign Message
      </button>
    </div>
  );
}
