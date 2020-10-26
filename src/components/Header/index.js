import React from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { Row, Col } from "react-bootstrap";
import WorkIcon from "@material-ui/icons/Work";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import "./styles.scss";
import mondaySdk from "monday-sdk-js";

//Custom
import queries from "../../api";
import { _currentBoard, _currentTimesheet } from "../../globals/variables";

const monday = mondaySdk();

function Header() {
  const { loading, error, data } = useQuery(queries.USERS_ITEMS, {
    fetchPolicy: "network-only",
    variables: { ids: _currentBoard() },
  });
  return (
    <div className="custom-header">
      <Row>
        <Col>
          <p className="text-main-32 bold">My Timesheets</p>
          <div>
            {/* <p className="text-subtitle-18">{getDateRange()}</p> */}
            <form noValidate>
              <TextField
                id="date"
                // label="Timesheet Period"
                type="week"
                defaultValue="2017-05-24"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </div>
        </Col>
        {loading ? null : (
          <Col style={{ textAlign: "right" }}>
            <span className="text-text-subtitle-18">
              Hello, <strong>{data.me.name}</strong>
            </span>
            <button
              onClick={() => {
                // TEMP FUNCTIONS TO RESET INSTANCE DB:
                monday.storage.instance
                  .setItem("timesheet_" + data.me.id + "_", JSON.stringify([]))
                  .then((res) => {
                    if (res.data.success) {
                      console.log("db instance reset: timesheet");
                      _currentTimesheet([]);
                    } else console.log("db reset failed: timesheet");
                  });
                // ------------------------------------
              }}
            >
              reset db instance
            </button>
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
