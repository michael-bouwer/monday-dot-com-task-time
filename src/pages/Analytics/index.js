import React, { Fragment, useState, useEffect } from "react";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import DateRangeRoundedIcon from "@material-ui/icons/DateRangeRounded";
import AssignmentRoundedIcon from "@material-ui/icons/AssignmentRounded";
import { useQuery } from "@apollo/client";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import MenuItem from "@material-ui/core/MenuItem";
import { Col, Row } from "react-bootstrap";
import { DatePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Loading from "../../components/Loading";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import Avatar from "@material-ui/core/Avatar";
import { Bar } from "@reactchartjs/react-chart.js";
import Tooltip from "@material-ui/core/Tooltip";
import mondaySdk from "monday-sdk-js";

//Custom
import queries from "../../api";
import { _currentBoard } from "../../globals/variables";
import {
  getTotalHoursLoggedBarData,
  getHoursWorkedBarData,
  getHoursOvertimeBarData,
  getAbsenceBarData,
} from "./calculations";
import "./styles.scss";

const monday = mondaySdk();

const defaultUserText = "Select a User";
const defaultTypeText = "Select a Type";

const reportModes = {
  // Scenario: Person works 50 hours in the week, takes 8 hours leave (1 day).
  TOTAL_HOURS_LOGGED: "Total Hours Logged", // = 58 hours
  HOURS_WORKED: "Hours Worked", // = 40 hours (max for average working week)
  HOURS_OVERTIME: "Hours Overtime", // 50 - 40 = 10 hours
  ABSENCE: "Absence", // 8 hours
};
const reports = [
  reportModes.TOTAL_HOURS_LOGGED,
  reportModes.HOURS_WORKED,
  reportModes.HOURS_OVERTIME,
  reportModes.ABSENCE,
];

const options = {
  maintainsAspectRatio: false,
  responsive: true,
  scales: {
    yAxes: [
      {
        stacked: true,
        ticks: {
          beginAtZero: true,
        },
      },
    ],
    xAxes: [
      {
        stacked: true,
      },
    ],
  },
};

function Analytics() {
  const { loading, error, data } = useQuery(queries.SUBSCRIBERS, {
    fetchPolicy: "network-only",
    variables: { ids: _currentBoard() },
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElType, setAnchorElType] = useState(null);
  const [selectedUser, setSelectedUser] = useState({ name: "Select a User" });
  const [selectedReportMode, setSelectedReportMode] = useState("Select a Type");
  const [date, setDate] = useState(moment());
  const [isOpen, setIsOpen] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [barData, setBarData] = useState();
  const [hoursTotal, setHoursTotal] = useState(0);
  const [hoursWorked, setHoursWorked] = useState(0);
  const [hoursOvertime, setHoursOvertime] = useState(0);
  const [hoursAbsence, setHoursAbsence] = useState(0);

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

  function getDateRangeForDisplay(inputDate) {
    var currentDate = inputDate; //moment();
    var weekStart = currentDate.clone().startOf("isoWeek");
    var weekEnd = currentDate.clone().endOf("isoWeek");
    return weekStart.format("Do MMM") + " - " + weekEnd.format("Do MMM");
  }

  function getDateRange(inputDate) {
    var currentDate = inputDate; //moment();
    var weekStart = currentDate.clone().startOf("isoWeek");
    var weekEnd = currentDate.clone().endOf("isoWeek");
    return weekStart.format("yyyyMMDD") + "-" + weekEnd.format("yyyyMMDD");
  }

  const generateReportForUsers = async (user) => {
    setLoadingReport(true);
    let allTimesheets = [];
    if (user) {
      await monday.storage.instance
        .getItem("timesheet_" + user.id + "_" + getDateRange(date))
        .then((res) => {
          const { value } = res.data;
          //sleep(10000); // someone may overwrite serialKey during this time
          if (value && value.length > 0) {
            allTimesheets.push({
              user: user,
              data: JSON.parse(value),
            });
          } else {
            allTimesheets.push({
              user: user,
              data: [],
            });
          }
          shapeData(allTimesheets);
          setLoadingReport(false);
        });
    } else {
      for (const sub of data.boards[0].subscribers) {
        await monday.storage.instance
          .getItem("timesheet_" + sub.id + "_" + getDateRange(date))
          .then((res) => {
            const { value } = res.data;
            //sleep(10000); // someone may overwrite serialKey during this time
            if (value && value.length > 0) {
              allTimesheets.push({
                user: sub,
                data: JSON.parse(value),
              });
            } else {
              allTimesheets.push({
                user: sub,
                data: [],
              });
            }
          });
      }
      shapeData(allTimesheets);
      setLoadingReport(false);
    }
  };

  function shapeData(timesheetData) {
    if (selectedReportMode === reportModes.TOTAL_HOURS_LOGGED) {
      let result = getTotalHoursLoggedBarData(timesheetData);
      setBarData(result.data);
      setHoursTotal(result.total);
      setHoursWorked(result.worked);
      setHoursOvertime(result.overtime);
      setHoursAbsence(result.absence);
    } else if (selectedReportMode === reportModes.HOURS_WORKED) {
      let result = getHoursWorkedBarData(timesheetData);
      setBarData(result.data);
      setHoursTotal(result.total);
      setHoursWorked(result.worked);
      setHoursOvertime(result.overtime);
      setHoursAbsence(result.absence);
    } else if (selectedReportMode === reportModes.HOURS_OVERTIME) {
      let result = getHoursOvertimeBarData(timesheetData);
      setBarData(result.data);
      setHoursTotal(result.total);
      setHoursWorked(result.worked);
      setHoursOvertime(result.overtime);
      setHoursAbsence(result.absence);
    } else if (selectedReportMode === reportModes.ABSENCE) {
      let result = getAbsenceBarData(timesheetData);
      setBarData(result.data);
      setHoursTotal(result.total);
      setHoursWorked(result.worked);
      setHoursOvertime(result.overtime);
      setHoursAbsence(result.absence);
    }
  }

  useEffect(() => {
    if (
      selectedUser.name !== "Select a User" &&
      selectedReportMode !== "Select a Type"
    ) {
      if (selectedUser.name === "Team") {
        // get for all team members
        generateReportForUsers();
      } else {
        generateReportForUsers(selectedUser);
      }
    }
  }, [selectedUser, selectedReportMode, date]);

  if (loading) return <Loading text="Shaping your data" />;
  if (error) return <span>something went wrong :(</span>;

  return (
    <div className="analytics">
      <Row style={{ margin: "0 16px" }}>
        <Col>
          {/* MENU */}
          <div className="center-all reporting-taskbar justify-content-between">
            <div className="center-all justify-content-start">
              {/* SELECT USER */}
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
                      {selectedUser.name}
                    </span>
                  </span>
                  <ArrowDropDownIcon />
                </div>
                <Popper
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  role={undefined}
                  transition
                  disablePortal
                  style={{
                    zIndex: "20",
                    marginTop: "2px",
                    minWidth: "260px",
                    maxWidth: "260px",
                  }}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom"
                            ? "center top"
                            : "center bottom",
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList
                            autoFocusItem={Boolean(anchorEl)}
                            id="menu-list-grow"
                            onKeyDown={handleClose}
                          >
                            <MenuItem
                              onClick={() => {
                                handleClose();
                                let user = {
                                  id: 0,
                                  name: "Team",
                                };
                                setSelectedUser(user);
                              }}
                            >
                              Team
                            </MenuItem>
                            {data.boards[0].subscribers.map((user) => {
                              return (
                                <MenuItem
                                  key={user.id}
                                  onClick={() => {
                                    handleClose();
                                    setSelectedUser(user);
                                  }}
                                >
                                  <span className="d-flex justify-content-start align-items-center">
                                    <span className="mr-2">
                                      <Avatar
                                        alt={user.name}
                                        src={user.photo_original}
                                      />
                                    </span>
                                    <span className="menu-item-text">
                                      {user.name}
                                    </span>
                                  </span>
                                </MenuItem>
                              );
                            })}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>

              {/* SELECT REPORT MODE */}
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
                      {selectedReportMode}
                    </span>
                  </span>
                  <ArrowDropDownIcon />
                </div>
                <Popper
                  open={Boolean(anchorElType)}
                  anchorEl={anchorElType}
                  role={undefined}
                  transition
                  disablePortal
                  style={{
                    zIndex: "20",
                    marginTop: "2px",
                    minWidth: "260px",
                    maxWidth: "260px",
                  }}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom"
                            ? "center top"
                            : "center bottom",
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleCloseType}>
                          <MenuList
                            autoFocusItem={Boolean(anchorElType)}
                            id="menu-list-grow"
                            onKeyDown={handleCloseType}
                          >
                            {reports.map((mode) => {
                              return (
                                <MenuItem
                                  key={mode}
                                  onClick={() => {
                                    handleCloseType();
                                    setSelectedReportMode(mode);
                                  }}
                                >
                                  {mode}
                                </MenuItem>
                              );
                            })}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
                {/* <Menu
                  id="simple-menu"
                  anchorEl={anchorElType}
                  keepMounted
                  open={Boolean(anchorElType)}
                  onClose={handleCloseType}
                >
                  {reports.map((mode) => {
                    return (
                      <MenuItem
                        key={mode}
                        onClick={() => {
                          handleCloseType();
                          setSelectedReportMode(mode);
                          getGraphData();
                        }}
                      >
                        {mode}
                      </MenuItem>
                    );
                  })}
                </Menu> */}
              </div>

              {/* SELECT DATE RANGE */}
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
                    {getDateRangeForDisplay(moment(date))}
                  </span>
                </div>
              </div>
              <span>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <Fragment>
                    <DatePicker
                      open={isOpen}
                      onOpen={() => setIsOpen(true)}
                      onClose={() => setIsOpen(false)}
                      animateYearScrolling
                      showTodayButton
                      style={{ display: "inline-block" }}
                      onChange={(value) => {
                        setDate(value);
                      }}
                      value={date}
                      TextFieldComponent={() => null}
                    />
                  </Fragment>
                </MuiPickersUtilsProvider>
              </span>
            </div>
            <div>
              {/* <Button
                secondary
                text="Export"
                icon={<ImportExportRoundedIcon />}
              ></Button> */}
            </div>
          </div>

          {/* CONTENT */}
          <Row className=" position-relative">
            {loadingReport ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "rgba(0, 0, 0, 0.5)",
                  position: "absolute",
                  zIndex: "10",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <span style={{ marginTop: "16px", color: "white" }}>
                  generating report...
                </span>
              </div>
            ) : null}
            <Col sm={9} className="card mt-2 h-100">
              <div>
                <Col>
                  <Bar data={barData} options={options} />
                </Col>
              </div>
            </Col>
            <Col
              sm={3}
              className="p-2 d-flex flex-column justify-content-around"
            >
              <div className="d-flex justify-content-center align-items-center flex-column">
                <span className="text-secondary-sub-24 font-weight-bolder">
                  {hoursTotal === 0.0 ? "--" : hoursTotal}
                </span>
                <Tooltip
                  title="All hours captured across all items"
                  placement="left"
                >
                  <span className="text-text-medium-14">TOTAL HOURS</span>
                </Tooltip>
              </div>

              <div className="d-flex justify-content-center align-items-center flex-column">
                <span className="text-secondary-sub-24 font-weight-bolder">
                  {hoursWorked === 0.0 ? "--" : hoursWorked}
                </span>
                <Tooltip
                  title="Total time worked including overtime, excluding absence."
                  placement="left"
                >
                  <span className="text-text-medium-14">HOURS WORKED</span>
                </Tooltip>
              </div>

              <div className="d-flex justify-content-center align-items-center flex-column">
                <span className="text-secondary-sub-24 font-weight-bolder">
                  {hoursOvertime === 0.0 ? "--" : hoursOvertime}
                </span>
                <Tooltip
                  title="Total time worked after 8 hours on each day"
                  placement="left"
                >
                  <span className="text-text-medium-14">HOURS OVERTIME</span>
                </Tooltip>
              </div>

              <div className="d-flex justify-content-center align-items-center flex-column">
                <span className="text-secondary-sub-24 font-weight-bolder">
                  {hoursAbsence === 0.0
                    ? "--"
                    : hoursAbsence +
                      "h / " +
                      parseFloat(hoursAbsence / 8).toFixed(1) +
                      "d"}
                </span>
                <Tooltip title="Total absence logged" placement="left">
                  <span className="text-text-medium-14">ABSENT</span>
                </Tooltip>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Analytics;
