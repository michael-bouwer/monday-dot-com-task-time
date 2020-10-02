import React from "react";
import "./styles.scss";

function Button({ large, medium, secondary, tertiary, text }) {
  let classes = "";

  if (large) classes = "btn-large ";
  else if (medium) classes = "btn-medium ";
  else classes = "btn-small ";

  if (tertiary) classes += "custom-btn-tertiary ";
  else if (secondary) classes += "custom-btn-secondary ";
  else classes += "custom-btn-primary ";

  return (
    <span className={classes}>
      <p style={{ display: "inline-block" }}>{text}</p>
    </span>
  );
}

export default Button;
