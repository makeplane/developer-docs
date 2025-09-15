import React from "react";

type Style = React.CSSProperties & {
  "--cols"?: number | string;
};

export const CardGroup = ({ cols, children }) => {
  return (
    <div className="card-group" style={{ "--cols": cols } as Style}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className="card">
          {child}
        </div>
      ))}
    </div>
  );
};
