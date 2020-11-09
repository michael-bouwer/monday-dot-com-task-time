import React, { Fragment, useState } from "react";
import ImportExportRoundedIcon from "@material-ui/icons/ImportExportRounded";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import DateRangeRoundedIcon from "@material-ui/icons/DateRangeRounded";
import AssignmentRoundedIcon from "@material-ui/icons/AssignmentRounded";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
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
import { DatePicker, KeyboardDatePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import DateRange from "@material-ui/icons/DateRange";
import MomentUtils from "@date-io/moment";
import "./styles.scss";

function Analytics() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElType, setAnchorElType] = useState(null);
  const [userText, setUserText] = useState("Select a User");
  const [typeText, setTypeText] = useState("Select a Type");
  const [date, setDate] = useState(moment());
  const [isOpen, setIsOpen] = useState(false);
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

  function getDateRange(inputDate) {
    var currentDate = inputDate; //moment();
    var weekStart = currentDate.clone().startOf("isoWeek");
    var weekEnd = currentDate.clone().endOf("isoWeek");
    return weekStart.format("Do MMM") + " - " + weekEnd.format("Do MMM");
  }

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
                <div
                  className="selector-button justify-content-between"
                  onClick={handleClick}
                >
                  <span className="d-flex">
                    <AccountCircleRoundedIcon />
                    <span
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      className="ml-2"
                    >
                      {userText}
                    </span>
                  </span>
                  <ArrowDropDownIcon />
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
                      setUserText("Michael Bouwer  iasdhia ids aid ishd");
                    }}
                  >
                    <span className="d-flex justify-content-start align-items-center">
                      <span className="mr-2">
                        <AccountCircleRoundedIcon />
                      </span>
                      Michael Bouwer Michael
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

              <div style={{ marginRight: "16px", display: "block" }}>
                <div
                  className="selector-button justify-content-between"
                  onClick={handleClickType}
                >
                  <span className="d-flex">
                    <AssignmentRoundedIcon />
                    <span
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      className="ml-2"
                    >
                      {typeText}
                    </span>
                  </span>
                  <ArrowDropDownIcon />
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

              <div
                style={{ marginRight: "16px" }}
                onClick={() => setIsOpen(true)}
              >
                <div className="selector-button d-flex">
                  <DateRangeRoundedIcon />
                  <span
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    className="ml-2"
                  >
                    {getDateRange(moment(date))}
                  </span>
                </div>
              </div>
              <span>
                {/* <CustomDatePicker
                  ref={datePickerRef}
                  style={{ display: "inline-block" }}
                  onClick={(value) => {
                    setDate(value);
                    //getTimesheetForWeek(value);
                  }}
                  value={date}
                  TextFieldComponent={() => null}
                /> */}
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <Fragment>
                    <DatePicker
                      open={isOpen}
                      onOpen={() => setIsOpen(true)}
                      onClose={() => setIsOpen(false)}
                      animateYearScrolling
                      showTodayButton
                      style={{ display: "inline-block" }}
                      onChange={setDate}
                      value={date}
                      TextFieldComponent={() => null}
                    />
                  </Fragment>
                </MuiPickersUtilsProvider>
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
