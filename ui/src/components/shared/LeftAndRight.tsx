import React from "react";

export default function LeftAndRight({
  left,
  right,
  style
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={style} className="row space-between">
      <div className="margin-user-right">{left}</div>
      <div className="strong">{right}</div>
    </div>
  );
}
