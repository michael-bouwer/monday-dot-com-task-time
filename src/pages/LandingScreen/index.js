import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import queries from "../../api";
import "./styles.scss";
import { _currentUser, _currentBoard } from "../../globals/variables";

//custom
import AddNew from "./AddNew";
import Existing from "./Existing";
import Button from "../../components/Button";
import GroupTimeSheets from "../GroupTimeSheets";
import MyTemplates from "./MyTemplates";
import TimeSheet from '../../components/TimeSheet';
import TimeCapture from "./TimeCapture";

const _pages = {
  GROUP_TIME_SHEETS: 1,
  TIMESHEET: 2,
  TIME_CAPTURE: 3,
};

function LandingScreen() {
  const [currentPage, setPage] = useState(_pages.GROUP_TIME_SHEETS);
  const { loading, error, data } = useQuery(queries.BOARD, {
    variables: { ids: _currentBoard() },
  });

  if (loading) return null;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <div className="header">
        <Button text="GROUP_TIME_SHEETS" onClick={(e) => getButtonEvent(e)} />
        <Button text="Time Sheet" onClick={(e) => getButtonEvent(e)} />
        <Button text="Time Capture" onClick={(e) => getButtonEvent(e)} />
      </div>
      {getCurrentPage()}
    </div>
  );

  function getCurrentPage() {
    if (currentPage === _pages.GROUP_TIME_SHEETS) {
      return <GroupTimeSheets />;
    } else if (currentPage === _pages.TIMESHEET) {
      return <TimeSheet />;
    } else if (currentPage === _pages.TIME_CAPTURE) {
      return <TimeCapture />;
    } 
  }

  function getButtonEvent(e) {
    switch (e.target.innerText) {
      case "GROUP_TIME_SHEETS":
        setPage(_pages.GROUP_TIME_SHEETS);
        break;
      case "Time Sheet":
        setPage(_pages.TIMESHEET);
        break;
      case "Time Capture":
        setPage(_pages.TIME_CAPTURE);
        break;
      default:
        setPage(_pages.GROUP_TIME_SHEETS);
        break;
    }
  }
}

export default LandingScreen;
