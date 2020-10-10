import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import queries from "../../api";
import "./styles.scss";
import { _currentUser, _currentBoard } from "../../globals/variables";

//custom
import AddNew from "../../sections/AddNew";
import Existing from "../../sections/Existing";
import Button from "../../components/Button";
import MyItems from "./MyItems";
import MyTemplates from "./MyTemplates";
import TimeCapture from "../../sections/TimeCapture";

const _pages = {
  MY_ITEMS: 1,
  MY_TEMPLATES: 2,
  TIME_CAPTURE: 3,
};

function LandingScreen() {
  const [currentPage, setPage] = useState(_pages.MY_ITEMS);
  const { loading, error, data } = useQuery(queries.BOARD, {
    variables: { ids: _currentBoard() },
  });

  if (loading) return null;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <div className="header">
        <Button text="My Items" onClick={(e) => getButtonEvent(e)} />
        <Button text="My Templates" onClick={(e) => getButtonEvent(e)} />
        <Button text="Time Capture" onClick={(e) => getButtonEvent(e)} />
      </div>
      {getCurrentPage()}
    </div>
  );

  function getCurrentPage() {
    if (currentPage === _pages.MY_ITEMS) {
      return <MyItems />;
    } else if (currentPage === _pages.MY_TEMPLATES) {
      return <MyTemplates />;
    } else if (currentPage === _pages.TIME_CAPTURE) {
      return <TimeCapture />;
    }
  }

  function getButtonEvent(e) {
    switch (e.target.innerText) {
      case "My Items":
        setPage(_pages.MY_ITEMS);
        break;
      case "My Templates":
        setPage(_pages.MY_TEMPLATES);
        break;
      case "Time Capture":
        setPage(_pages.TIME_CAPTURE);
        break;
      default:
        setPage(_pages.MY_ITEMS);
        break;
    }
  }
}

export default LandingScreen;
