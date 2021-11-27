import React, { ReactNode } from "react";
import Tooltip from "./Tooltip";

export default function OnClickSpan({
  textBeforeClick,
  textOnClick,
  textOnClicking,
  resetMs = 3000,
  children,
  onClick
}: {
  textBeforeClick: string;
  textOnClick: string;
  textOnClicking?: string;
  resetMs?: number;
  children?: ReactNode;
  onClick: (() => void) | (() => Promise<void>);
}) {
  const [clicked, setClicked] = React.useState(false);
  const [clicking, setClicking] = React.useState(false);
  const text = clicked
    ? textOnClick
    : clicking
    ? textOnClicking || textBeforeClick
    : textBeforeClick;

  const doOnClick = () => {
    const job = onClick();
    if (!job) setClicked(true);
    else {
      setClicking(true);
      job
        .catch(() => {})
        .then(() => {
          setClicking(false);
          setClicked(true);
        });
    }
  };

  React.useEffect(() => {
    if (!clicked) return;
    const handle = setTimeout(() => {
      setClicked(false);
    }, resetMs);

    return () => {
      window.clearTimeout(handle);
    };
  }, [clicked, resetMs]);

  return (
    <Tooltip text={text}>
      <span
        style={{
          cursor: "pointer"
        }}
        onClick={doOnClick}>
        {children}
      </span>
    </Tooltip>
  );
}
