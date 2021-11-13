import React from "react";

export default function Loading({ speedMs = 100, loadingText = "loading" }) {
  const [text, setText] = React.useState(loadingText);

  React.useEffect(() => {
    const handle = window.setInterval(() => {
      setText(t => (t === loadingText + "..." ? loadingText : t + "."));
    }, speedMs);

    return () => {
      window.clearInterval(handle);
    };
  }, [speedMs, loadingText]);

  return (
    <div>
      <p>{text}</p>
    </div>
  );
}
