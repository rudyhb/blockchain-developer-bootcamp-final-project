import React, { ReactNode } from "react";
import Tooltip from "./Tooltip";

export default function OnClickSpan({
  textBeforeClick,
  textOnClick,
  resetMs = 3000,
  children,
  onClick
}: {
  textBeforeClick: string;
  textOnClick: string;
  resetMs?: number;
  children?: ReactNode;
  onClick: () => void;
}) {
  const [clicked, setClicked] = React.useState(false);
  const text = clicked ? textOnClick : textBeforeClick;

  const doOnClick = () => {
    onClick();
    setClicked(true);
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
