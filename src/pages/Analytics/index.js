import React, { Component, useRef, useState } from "react";
import ImportExportRoundedIcon from "@material-ui/icons/ImportExportRounded";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import DateRangeRoundedIcon from "@material-ui/icons/DateRangeRounded";
import AssignmentRoundedIcon from "@material-ui/icons/AssignmentRounded";
import FormControl from "@material-ui/core/FormControl";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Button from "../../components/Button";
import { Col, Row } from "react-bootstrap";
import { CustomBar, CustomPolar } from "../../components/Charts";
import CustomDatePicker from "../../components/CustomDatePicker";
import moment from "moment";
import "./styles.scss";

function Analytics() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElType, setAnchorElType] = useState(null);
  const [userText, setUserText] = useState("User");
  const [typeText, setTypeText] = useState("Type");
  const datePickerRef = useRef();
  const [date, setDate] = useState(moment());
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickType = (event) => {
    setAnchorElType(event.currentTarget);
  };

  const handleCloseType = () => {
    setAnchorElType(null);
  };
  return (
    <div className="analytics">
      <Row style={{ margin: "0 16px" }}>
        {/* <Col sm={8}>
          <span className="text-subtitle-18 dark-gray analytical-block text-uppercase">
            CHART Here
          </span>
          <div className="card mt-2">
            <CustomBar />
          </div>
        </Col>

        <Col sm={4}>
          <span className="text-subtitle-18 dark-gray analytical-block text-uppercase">
            Pie Here
          </span>
          <div className="card mt-2">
            <CustomPolar />
          </div>
        </Col> */}
        <Col>
          <span className="text-subtitle-18 dark-gray analytical-block text-uppercase">
            FILTERS
          </span>
          <div className="center-all reporting-taskbar justify-content-between">
            <div className="center-all justify-content-start">
              <div style={{ marginRight: "16px" }}>
                <div className="selector-button" onClick={handleClick}>
                  <AccountCircleRoundedIcon />
                  <span
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    className="ml-2"
                  >
                    {userText}
                  </span>
                </div>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      setUserText("Team");
                    }}
                  >
                    Team
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      setUserText("Michael Bouwer");
                    }}
                  >
                    <span className="d-flex justify-content-start align-items-center">
                      <span className="mr-2">
                        <AccountCircleRoundedIcon />
                      </span>
                      Michael Bouwer
                    </span>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      setUserText("Ross Viljoen");
                    }}
                  >
                    <span className="d-flex justify-content-start align-items-center">
                      <span className="mr-2">
                        <AccountCircleRoundedIcon />
                      </span>
                      Ross Viljoen
                    </span>
                  </MenuItem>
                </Menu>
              </div>

              <div style={{ marginRight: "16px" }}>
                <div className="selector-button" onClick={handleClickType}>
                  <AssignmentRoundedIcon />
                  <span
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    className="ml-2"
                  >
                    {typeText}
                  </span>
                </div>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorElType}
                  keepMounted
                  open={Boolean(anchorElType)}
                  onClose={handleCloseType}
                >
                  <MenuItem
                    onClick={() => {
                      handleCloseType();
                      setTypeText("Hours Logged");
                    }}
                  >
                    Hours Logged
                  </MenuItem>
                </Menu>
              </div>

              {/* <div style={{ marginRight: "16px" }}>
                <div
                  className="selector-button"
                  onClick={() => {
                    debugger;
                    console.log(datePickerRef.current);
                  }}
                >
                  <span
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    className="ml-2"
                  >
                    Date
                  </span>
                </div>
              </div> */}
              <span
              // style={{ display: "none" }}
              >
                <CustomDatePicker
                  ref={datePickerRef}
                  style={{ display: "inline-block" }}
                  onClick={(value) => {
                    setDate(value);
                    //getTimesheetForWeek(value);
                  }}
                  value={date}
                />
              </span>
            </div>
            <div>
              <Button
                secondary
                text="Export"
                icon={<ImportExportRoundedIcon />}
              ></Button>
            </div>
          </div>
          <div className="card mt-2"></div>
        </Col>
      </Row>
    </div>
  );
}

export default Analytics;
