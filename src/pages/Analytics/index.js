import React, { Fragment, useState, useEffect } from "react";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import DateRangeRoundedIcon from "@material-ui/icons/DateRangeRounded";
import AssignmentRoundedIcon from "@material-ui/icons/AssignmentRounded";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import PeopleAltRoundedIcon from "@material-ui/icons/PeopleAltRounded";
import PollOutlinedIcon from "@material-ui/icons/PollOutlined";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import PieChartOutlinedIcon from "@material-ui/icons/PieChartOutlined";
import PieChartIcon from "@material-ui/icons/PieChart";
import { useSpring, animated } from "react-spring";
import { useQuery } from "@apollo/client";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import MenuItem from "@material-ui/core/MenuItem";
import { Col, Row } from "react-bootstrap";
import { DatePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Badge from "@material-ui/core/Badge";
import Loading from "../../components/Loading";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import Avatar from "@material-ui/core/Avatar";
import { Bar, Pie, Doughnut } from "@reactchartjs/react-chart.js";
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

const barOptions = {
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

const pieOptions = {
  rotation: -Math.PI, //-Math.PI / 2,
  circumference: Math.PI, //2 * Math.PI,
  tooltips: {
    callbacks: {
      label: function (item, data) {
        console.log(data.labels, item);
        return (
          data.datasets[item.datasetIndex].label +
          ": " +
          data.labels[item.index] +
          ": " +
          data.datasets[item.datasetIndex].data[item.index]
        );
      },
    },
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
  const [pieData, setPieData] = useState();
  const [hoursTotal, setHoursTotal] = useState(0);
  const [hoursWorked, setHoursWorked] = useState(0);
  const [hoursOvertime, setHoursOvertime] = useState(0);
  const [hoursAbsence, setHoursAbsence] = useState(0);
  const [barSelected, setBarSelected] = useState(true);

  const props = useSpring({
    to: { opacity: 1, marginTop: 0 },
    from: { opacity: 0, marginTop: 64 },
  });

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

  function getPreviousWeekTimesheet(currentDate) {
    var thisTimeLastWeek = moment(currentDate).subtract(1, "weeks");
    setDate(thisTimeLastWeek);
  }
  function getNextWeekTimesheet(currentDate) {
    var thisTimeNextWeek = moment(currentDate).add(1, "weeks");
    setDate(thisTimeNextWeek);
  }

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
      setBarData(result.dataBar);
      setPieData(result.dataPie);
      setHoursTotal(result.total);
      setHoursWorked(result.worked);
      setHoursOvertime(result.overtime);
      setHoursAbsence(result.absence);
    } else if (selectedReportMode === reportModes.HOURS_WORKED) {
      let result = getHoursWorkedBarData(timesheetData);
      setBarData(result.dataBar);
      setPieData(result.dataPie);
      debugger;
      setHoursTotal(result.total);
      setHoursWorked(result.worked);
      setHoursOvertime(result.overtime);
      setHoursAbsence(result.absence);
    } else if (selectedReportMode === reportModes.HOURS_OVERTIME) {
      let result = getHoursOvertimeBarData(timesheetData);
      setBarData(result.dataBar);
      setPieData(result.dataPie);
      setHoursTotal(result.total);
      setHoursWorked(result.worked);
      setHoursOvertime(result.overtime);
      setHoursAbsence(result.absence);
    } else if (selectedReportMode === reportModes.ABSENCE) {
      let result = getAbsenceBarData(timesheetData);
      setBarData(result.dataBar);
      setPieData(result.dataPie);
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

  if (error) return <span>something went wrong :(</span>;

  return (
    <animated.div className="analytics" style={props}>
      {loading ? <Loading text="Shaping your data" /> : null}
      <Row style={{ margin: "0 16px" }}>
        <Col>
          {/* MENU */}
          <div className="center-all reporting-taskbar justify-content-between">
            <div className="center-all justify-content-start">
              {/* SELECT USER */}
              <div style={{ marginRight: "16px" }}>
                <Badge
                  color="secondary"
                  variant="dot"
                  invisible={selectedUser.name !== "Select a User"}
                >
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
                </Badge>
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
                              <span className="d-flex justify-content-start align-items-center">
                                <span className="mr-2">
                                  <Avatar
                                    alt="Team"
                                    children={<PeopleAltRoundedIcon />}
                                  />
                                </span>
                                <span className="menu-item-text">Team</span>
                              </span>
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
                <Badge
                  color="secondary"
                  variant="dot"
                  invisible={selectedReportMode !== "Select a Type"}
                >
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
                </Badge>
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
          <Row className="position-relative analytics-content">
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
            <Col sm={8} className="card mt-2 h-100">
              <div>
                <div className="center-all justify-content-between mb-2">
                  <ArrowBackIosRoundedIcon
                    onClick={() => {
                      getPreviousWeekTimesheet(date);
                    }}
                    className="arrow"
                  />
                  {/* <div className="center-all">
                  <span className="text-paragraph-16 day">
                    {getStartDay(date)}
                  </span>
                  <div className="ml-2 mr-2">
                    <ArrowRightAltRoundedIcon />
                  </div>
                  <span className="text-paragraph-16 day">
                    {getEndDay(date)}
                  </span>
                </div> */}
                  <ArrowForwardIosRoundedIcon
                    onClick={() => {
                      getNextWeekTimesheet(date);
                    }}
                    className="arrow"
                  />
                </div>
                <div>
                  <Col>
                    {barSelected ? (
                      <Bar data={barData} options={barOptions} />
                    ) : (
                      <Pie data={pieData} options={pieOptions} />
                    )}
                  </Col>
                  <Row>
                    {selectedUser !== "Select a User" &&
                    selectedReportMode !== "Select a Type" ? (
                      <Col className="center-all chart-icons mt-2 mb-2">
                        <span
                          className="mr-2"
                          onClick={() => setBarSelected(true)}
                        >
                          {barSelected ? (
                            <span className="selected-icon">
                              <InsertChartIcon />
                            </span>
                          ) : (
                            <PollOutlinedIcon />
                          )}
                        </span>
                        <span onClick={() => setBarSelected(false)}>
                          {barSelected ? (
                            <PieChartOutlinedIcon />
                          ) : (
                            <span className="selected-icon">
                              <PieChartIcon />
                            </span>
                          )}
                        </span>
                      </Col>
                    ) : null}
                  </Row>
                </div>
              </div>
            </Col>
            <Col
              sm={4}
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
    </animated.div>
  );
}

export default Analytics;
