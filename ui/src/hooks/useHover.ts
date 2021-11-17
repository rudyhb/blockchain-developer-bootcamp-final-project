import React from "react";

export default function useHover() {
  const [hovering, setHover] = React.useState(false);
  const onMouseOver = () => {
    setHover(true);
  };
  const onMouseOut = () => {
    setHover(false);
  };

  const attr = { onMouseOver, onMouseOut };

  return [hovering, attr] as const;
}
