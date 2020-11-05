import React from "react";
import "./styles.scss";

function Button({ large, medium, secondary, tertiary, text, onClick, icon, }) {
  let classes = "";

  if (large) classes = "btn-large ";
  else if (medium) classes = "btn-medium ";
  else classes = "btn-small ";

  if (tertiary) classes += "custom-btn-tertiary ";
  else if (secondary) classes += "custom-btn-secondary ";
  else classes += "custom-btn-primary ";

  return (
    <button className={classes} onClick={onClick}>
      {icon ? <span className="mr-2">{icon}</span> : null}
      <p style={{ display: "inline-block" }}>{text}</p>
    </button>
  );
}

export default Button;
