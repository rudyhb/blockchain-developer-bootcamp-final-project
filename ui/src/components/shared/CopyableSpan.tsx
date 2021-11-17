import React, { ReactNode } from "react";
import OnClickSpan from "./OnClickSpan";

export default function CopyableSpan({
  copyValue,
  children
}: {
  copyValue: string;
  children?: ReactNode;
}) {
  const onClick = () => {
    navigator.clipboard
      .writeText(copyValue)
      .catch(e => console.error("error copying value:", e));
  };

  return (
    <OnClickSpan textBeforeClick="copy" textOnClick="copied!" onClick={onClick}>
      {children}
    </OnClickSpan>
  );
}
