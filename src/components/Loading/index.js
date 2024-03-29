import React from "react";
import { ReactComponent as LoadingSVG } from "../../assets/svg/loading.svg";
import "./styles.scss";

function Loading({ text }) {
  return (
    <div className="loading" style={{ position: "fixed", left: "0", top: "0" }}>
      <div className="modal">
        <LoadingSVG width="100px" height="100px" />
        <div>
          <span className="text-text-paragraph-16 text ">{text}</span>
        </div>
      </div>
    </div>
  );
}

export default Loading;
