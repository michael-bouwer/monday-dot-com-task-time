import React, { useEffect } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { Row, Col } from "react-bootstrap";
import TocRoundedIcon from "@material-ui/icons/TocRounded";
import EqualizerRoundedIcon from "@material-ui/icons/EqualizerRounded";
import PeopleAltRoundedIcon from "@material-ui/icons/PeopleAltRounded";
import PrintRoundedIcon from "@material-ui/icons/PrintRounded";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import "./styles.scss";
import mondaySdk from "monday-sdk-js";

//Custom
import queries from "../../api";
import {
  _currentBoard,
  _currentTimesheet,
  _currentComponent,
  _pages,
} from "../../globals/variables";

const monday = mondaySdk();

function Header() {
  const { loading, error, data, refetch } = useQuery(queries.USERS_ITEMS, {
    fetchPolicy: "network-only",
    variables: { ids: _currentBoard() },
  });

  const selectedPage = useReactiveVar(_currentComponent);
  let pageName = "";
  if (selectedPage === _pages.TIMESHEET) pageName = "My Timesheet";
  else if (selectedPage === _pages.COMPONENTA) pageName = "Component A";
  else if (selectedPage === _pages.COMPONENTB) pageName = "Component B";
  else if (selectedPage === _pages.COMPONENTC) pageName = "Component C";

  useEffect(() => {
    var callback = (res) => {
      refetch(); // This refreshes the USERS_ITEMS cache every time an event ocurs. This will not affect the user until they query USERS_ITEMS from cache. Less intrusive.
    };
    monday.listen("events", callback);
  }, []);

  return (
    <div className="custom-header">
      <Row>
        <Col className="page-name">
          <p className="text-main-32 bold heading">{pageName}</p>
          {selectedPage === _pages.TIMESHEET ? (
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
          ) : null}
        </Col>
        {loading ? null : (
          <Col style={{ textAlign: "right" }}>
            {/* <span className="text-text-subtitle-18">
              Hello, <strong>{data.me.name}</strong>
            </span> */}
            <div className="nav-buttons">
              <button
                onClick={() => {
                  // TEMP FUNCTIONS TO RESET INSTANCE DB:

                  monday.storage.instance
                    .setItem(
                      "timesheet_" + data.me.id + "_",
                      JSON.stringify([])
                    )
                    .then((res) => {
                      if (res.data.success) {
                        console.log("db instance reset: timesheet");
                        _currentTimesheet([]);
                      } else console.log("db reset failed: timesheet");
                    });
                  // ------------------------------------
                }}
              >
                DELETE DB!
              </button>

              <Tooltip title="Component A">
                <div
                  className={`timesheet-icon ${
                    selectedPage === _pages.COMPONENTA ? "selected" : ""
                  }`}
                  onClick={() => _currentComponent(_pages.COMPONENTA)}
                >
                  <EqualizerRoundedIcon />
                </div>
              </Tooltip>

              <Tooltip title="Component B">
                <div
                  className={`timesheet-icon ${
                    selectedPage === _pages.COMPONENTB ? "selected" : ""
                  }`}
                  onClick={() => _currentComponent(_pages.COMPONENTB)}
                >
                  <PeopleAltRoundedIcon />
                </div>
              </Tooltip>

              <Tooltip title="Component C">
                <div
                  className={`timesheet-icon ${
                    selectedPage === _pages.COMPONENTC ? "selected" : ""
                  }`}
                  onClick={() => _currentComponent(_pages.COMPONENTC)}
                >
                  <PrintRoundedIcon />
                </div>
              </Tooltip>

              <Tooltip title="My Timesheet">
                <div
                  className={`timesheet-icon ${
                    selectedPage === _pages.TIMESHEET ? "selected" : ""
                  }`}
                  onClick={() => _currentComponent(_pages.TIMESHEET)}
                >
                  <TocRoundedIcon />
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
