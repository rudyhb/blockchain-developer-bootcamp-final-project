import React from "react";
import useHover from "../../hooks/useHover";

const styles: { container: React.CSSProperties; tooltip: React.CSSProperties } =
  {
    container: {
      position: "relative"
    },
    tooltip: {
      position: "absolute",
      width: "160px",
      bottom: "100%",
      left: "50%",
      marginLeft: "-80px",
      borderRadius: "3px",
      backgroundColor: "hsla(0, 0%, 20%, 0.9)",
      color: "#fff",
      textAlign: "center",
      fontSize: "14px"
    }
  };

export default function Tooltip({
                                  text,
                                  children
                                }: {
  text: string;
  children?: React.ReactNode;
}) {
  const [hovering, hoverAttributes] = useHover();

  return (
    <span style={styles.container} {...hoverAttributes}>
      {hovering && <div className='btn btn-clear' style={styles.tooltip}>{text}</div>}
      {children}
    </span>
  );
}
