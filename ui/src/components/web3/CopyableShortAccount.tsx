import React from "react";
import CopyableSpan from "../shared/CopyableSpan";

export default function CopyableShortAccount({
  account
}: {
  account?: string | null;
}) {
  if (!account) return null;
  return (
    <CopyableSpan copyValue={account}>
      {account.substring(0, 6)}...
      {account.substring(account.length - 4)}
    </CopyableSpan>
  );
}
