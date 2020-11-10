import React, { Fragment, useState } from "react";
import ImportExportRoundedIcon from "@material-ui/icons/ImportExportRounded";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import DateRangeRoundedIcon from "@material-ui/icons/DateRangeRounded";
import AssignmentRoundedIcon from "@material-ui/icons/AssignmentRounded";
import { useQuery, useReactiveVar } from "@apollo/client";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Col, Row } from "react-bootstrap";
import { DatePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Loading from "../../components/Loading";
import moment from "moment";
import MomentUtils from "@date-io/moment";

//Custom
import queries from "../../api";
import { _currentBoard } from "../../globals/variables";
import { CustomBar } from "../../components/Charts";
import Button from "../../components/Button";
import "./styles.scss";

const defaultUserText = "Select a User";
const defaultTypeText = "Select a Type";

function Analytics() {
  const { loading, error, data, refetch } = useQuery(queries.SUBSCRIBERS, {
    fetchPolicy: "network-only",
    variables: { ids: _currentBoard() },
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElType, setAnchorElType] = useState(null);
  const [userText, setUserText] = useState(defaultUserText);
  const [typeText, setTypeText] = useState(defaultTypeText);
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

  function generateReport() {
    if (userText === defaultUserText || typeText === defaultTypeText) {
      //require user input
    } else {
      //load chart
    }
  }

  if (loading) return <Loading text="Shaping your data" />;
  if (error) return <span>something went wrong :(</span>;

  return (
    <div className="analytics">
      <Row style={{ margin: "0 16px" }}>
        <Col>
          {/* MENU */}
          <div className="center-all reporting-taskbar justify-content-between">
            <div className="center-all justify-content-start">
              <div style={{ marginRight: "16px" }}>
                <div
                  className="selector-button justify-content-between"
                  onClick={handleClick}
                >
                  <span className="d-flex align-items-center">
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
                  <span className="d-flex align-items-center">
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

          {/* CONTENT */}
          <Row>
            <Col sm={9} className="card mt-2 h-100">
              {userText === defaultUserText || typeText === defaultTypeText ? (
                <h4>Need user input</h4>
              ) : (
                <div>
                  <Col>
                    <CustomBar />
                  </Col>
                </div>
              )}
            </Col>

            {userText === defaultUserText || typeText === defaultTypeText ? (
              <Col sm={3} className="p-2 flex-column justify-content-around">
                <h4>Need user input</h4>
              </Col>
            ) : (
              <Col
                sm={3}
                className="p-2 d-flex flex-column justify-content-around"
              >
                <div className="d-flex justify-content-center align-items-center flex-column">
                  <span className="text-secondary-sub-24 font-weight-bolder">
                    177
                  </span>
                  <span className="text-text-medium-14">TOTAL HOURS</span>
                </div>

                <div className="d-flex justify-content-center align-items-center flex-column">
                  <span className="text-secondary-sub-24 font-weight-bolder">
                    160
                  </span>
                  <span className="text-text-medium-14">HOURS WORKED</span>
                </div>

                <div className="d-flex justify-content-center align-items-center flex-column">
                  <span className="text-secondary-sub-24 font-weight-bolder">
                    17
                  </span>
                  <span className="text-text-medium-14">HOURS OVERTIME</span>
                </div>

                <div className="d-flex justify-content-center align-items-center flex-column">
                  <span className="text-secondary-sub-24 font-weight-bolder">
                    2
                  </span>
                  <span className="text-text-medium-14">DAYS ABSENT</span>
                </div>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Analytics;
