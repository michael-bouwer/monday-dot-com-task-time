import React from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { Row, Col } from "react-bootstrap";
import WorkIcon from "@material-ui/icons/Work";
import Tooltip from "@material-ui/core/Tooltip";
import moment from "moment";
import "./styles.scss";

//Custom
import queries from "../../api";
import { _currentBoard, _currentTimesheet } from "../../globals/variables";

function Header() {
  const { loading, error, data } = useQuery(queries.USERS_ITEMS, {
    fetchPolicy: "network-only",
    variables: { ids: _currentBoard() },
  });
  return (
    <div className="custom-header">
      <Row>
        <Col>
          <p className="text-main-32 bold">Timesheet for week:</p>
          <div>
            <p className="text-subtitle-18">{getDateRange()}</p>
          </div>
        </Col>
        {loading ? null : (
          <Col style={{ textAlign: "right" }}>
            <span className="text-text-subtitle-18">
              Hello, <strong>{data.me.name}</strong>
            </span>
            <div className="nav-buttons">
              <Tooltip title="My Timesheet">
                <div className="timesheet-icon">
                  <WorkIcon />
                </div>
              </Tooltip>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
}

function getDateRange(inputDate) {
  var currentDate = moment();
  var weekStart = currentDate.clone().startOf("isoWeek");
  var weekEnd = currentDate.clone().endOf("isoWeek");

  return (
    weekStart.format("Do MMM") +
    " - " +
    weekEnd.format("Do MMM") +
    " (Monday - Sunday)"
  );
}

export default Header;
