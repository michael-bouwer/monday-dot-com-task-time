import React, { useEffect } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { Row, Col } from "react-bootstrap";
import EqualizerRoundedIcon from "@material-ui/icons/EqualizerRounded";
import PeopleAltRoundedIcon from "@material-ui/icons/PeopleAltRounded";
import ListAltRoundedIcon from "@material-ui/icons/ListAltRounded";
import Tooltip from "@material-ui/core/Tooltip";
import moment from "moment";
import "./styles.scss";
import mondaySdk from "monday-sdk-js";
import { ReactComponent as Logo } from "../../assets/svg/TaskTime_Logo.svg";

//Custom
import queries from "../../api";
import {
  _currentBoard,
  _currentComponent,
  _pages,
} from "../../globals/variables";

const monday = mondaySdk();

function Header() {
  const { loading, refetch } = useQuery(queries.USERS_ITEMS, {
    fetchPolicy: "network-only",
    variables: { ids: _currentBoard() },
  });

  const selectedPage = useReactiveVar(_currentComponent);
  let pageName = "";
  if (selectedPage === _pages.TIMESHEET) pageName = "My Timesheet";
  else if (selectedPage === _pages.USERS) pageName = "Team";
  else if (selectedPage === _pages.ANALYTICS)
    pageName = "Analytics and Reporting";

  useEffect(() => {
    var callback = (res) => {
      refetch(); // This refreshes the USERS_ITEMS cache every time an event ocurs. This will not affect the user until they query USERS_ITEMS from cache. Less intrusive.
    };
    monday.listen("events", callback);
  }, [refetch]);

  return loading ? null : (
    <div className="custom-header">
      <Row>
        <Col className="page-name">
          <p className="text-main-32 bold heading">{pageName}</p>
        </Col>
        <Col className="center-all">
          <Logo width="150px" />
        </Col>
        <Col style={{ textAlign: "right" }}>
          {/* <span className="text-text-subtitle-18">
              Hello, <strong>{data.me.name}</strong>
            </span> */}
          <div className="nav-buttons">
            <Tooltip title="Analytics and Reporting">
              <div
                className={`timesheet-icon ${
                  selectedPage === _pages.ANALYTICS ? "selected" : ""
                }`}
                onClick={() => _currentComponent(_pages.ANALYTICS)}
              >
                <EqualizerRoundedIcon />
              </div>
            </Tooltip>

            <Tooltip title="Team">
              <div
                className={`timesheet-icon ${
                  selectedPage === _pages.USERS ? "selected" : ""
                }`}
                onClick={() => _currentComponent(_pages.USERS)}
              >
                <PeopleAltRoundedIcon />
              </div>
            </Tooltip>

            <Tooltip title="My Timesheet">
              <div
                className={`timesheet-icon ${
                  selectedPage === _pages.TIMESHEET ? "selected" : ""
                }`}
                onClick={() => _currentComponent(_pages.TIMESHEET)}
              >
                <ListAltRoundedIcon />
              </div>
            </Tooltip>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Header;
