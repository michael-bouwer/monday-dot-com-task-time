import React, { useState, useRef, useEffect, Fragment } from "react";
import { Col, Row, Table } from "react-bootstrap";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import { useSpring, animated } from "react-spring";
import "./styles.scss";
import { useQuery, useReactiveVar } from "@apollo/client";
import Tooltip from "@material-ui/core/Tooltip";
import TimerRoundedIcon from "@material-ui/icons/TimerRounded";
import moment from "moment";
import mondaySdk from "monday-sdk-js";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import DateRangeRoundedIcon from "@material-ui/icons/DateRangeRounded";
import { DatePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

//Custom
import queries from "../../api";
import {
  _currentBoard,
  _currentTimesheet,
  _loadingMessages,
} from "../../globals/variables";
import Loading from "../../components/Loading";
import CustomDatePicker from "../../components/CustomDatePicker";
import Button from "../../components/Button";

const monday = mondaySdk();

function UserTimesheet({ user, goBack }) {
  const props = useSpring({
    to: { marginLeft: 0, opacity: 1 },
    from: { marginLeft: 50, opacity: 0 },
  });

  return (
    <div>
      <animated.div style={props}>
        <Row>
          <Col>
            <div className="center-all justify-content-between mb-2">
              <div className="center-all">
                <IconButton
                  style={{ marginLeft: "-16px" }}
                  component="span"
                  onClick={() => goBack()}
                >
                  <ArrowBackRoundedIcon />
                </IconButton>
                <span className="text-secondary-sub-24">{user.name}</span>
              </div>
              <div className="center-all">
                {/* <span className="mr-2">
                  <Button
                    text="Print"
                    icon={<PrintRoundedIcon />}
                  ></Button>
                </span> */}
              </div>
            </div>
          </Col>
        </Row>
        <Timesheet user={user} />
      </animated.div>
    </div>
  );
}

function Timesheet({ user }) {
  const { loading, error, data } = useQuery(queries.USERS_ITEMS, {
    //fetchPolicy: "network-only",
    variables: { ids: _currentBoard() },
  });

  if (loading)
    return (
      <Loading
        text={
          _loadingMessages[Math.floor(Math.random() * _loadingMessages.length)]
        }
      />
    );
  if (error) return <p>error</p>;
  return <GetTimesheet data={data} user={user} />;
}

function getDateRange(inputDate) {
  var currentDate = inputDate; //moment();
  var weekStart = currentDate.clone().startOf("isoWeek");
  var weekEnd = currentDate.clone().endOf("isoWeek");

  return weekStart.format("yyyyMMDD") + "-" + weekEnd.format("yyyyMMDD");
}

function GetTimesheet({ data, user }) {
  const timesheet = useReactiveVar(_currentTimesheet);
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState(() => getSums());
  const [date, setDate] = useState(moment());
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef();

  const props = useSpring({
    to: { opacity: 1, marginTop: 0 },
    from: { opacity: 0, marginTop: 64 },
  });

  const getTimesheetForWeek = async (dateRange) => {
    setLoading(true);
    _currentTimesheet(null);
    await monday.storage.instance
      .getItem("timesheet_" + user.id + "_" + getDateRange(dateRange))
      .then((res) => {
        const { value } = res.data;
        //sleep(10000); // someone may overwrite serialKey during this time
        if (value && value.length > 0) {
          let items = JSON.parse(value); //Need to establish if items are still valid on the main board.
          items.forEach((item) => {
            let found = false;
            data.boards[0].items.forEach((boardItem) => {
              if (item.id === boardItem.id) {
                found = true;
              }
            });
            if (!found && item.type === "item") {
              item["deleted"] = true;
            }
          });
          _currentTimesheet(items);
          setSummaries(getSums(items));
        } else {
          _currentTimesheet([]);
        }
        setLoading(false);
      });
  };
  
  function getDateRangeForDisplay(inputDate) {
    var currentDate = inputDate; //moment();
    var weekStart = currentDate.clone().startOf("isoWeek");
    var weekEnd = currentDate.clone().endOf("isoWeek");
    return weekStart.format("Do MMM") + " - " + weekEnd.format("Do MMM");
  }

  function getPreviousWeekTimesheet(currentDate) {
    var thisTimeLastWeek = moment(currentDate).subtract(1, "weeks");
    setDate(thisTimeLastWeek);
    getTimesheetForWeek(thisTimeLastWeek);
    datePickerRef.current.setDateFromParentComponent(thisTimeLastWeek);
  }
  function getNextWeekTimesheet(currentDate) {
    var thisTimeNextWeek = moment(currentDate).add(1, "weeks");
    setDate(thisTimeNextWeek);
    getTimesheetForWeek(thisTimeNextWeek);
    datePickerRef.current.setDateFromParentComponent(thisTimeNextWeek);
  }

  function getSums(timesheetObject) {
    let processData = timesheetObject ? timesheetObject : timesheet; //Updating the global timesheet doesn't always happen before sums get calculated.
    let sums = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    if (processData && processData.length > 0) {
      //valid timesheet, calculate sums
      processData.forEach((item) => {
        item.timeCaptureForDaysOfWeek.forEach((dayOfWeek, index) => {
          sums[index] += parseFloat(dayOfWeek);
        });
      });
    }
    return sums;
  }

  function getWeekdaySum(dayValues) {
    let sum = 0;
    dayValues.forEach((value) => {
      sum += parseFloat(value);
    });

    return sum.toFixed(2);
  }

  function getDay(index) {
    var currentDate = date;
    var weekStart = currentDate.clone().startOf("isoWeek");

    return weekStart.add(index, "days").format("ddd D");
  }

  useEffect(() => {
    setLoading(true);
    getTimesheetForWeek(date);
  }, []);

  return (
    <animated.div style={props}>
      {loading ? (
        <Loading
          text={`Fetching ${user.name}'s timesheet for the selected week.`}
        />
      ) : null}
      <Row>
        <Col className="tab">
          {/* <CustomDatePicker
            ref={datePickerRef}
            style={{ display: "inline-block" }}
            onClick={(value) => {
              setDate(value);
              getTimesheetForWeek(value);
            }}
            value={date}
          /> */}
          <div style={{ marginRight: "16px", display: "flex" }}>
            <div className="selector-button" onClick={() => setIsOpen(true)}>
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
                    getTimesheetForWeek(value);
                  }}
                  value={date}
                  TextFieldComponent={() => null}
                />
              </Fragment>
            </MuiPickersUtilsProvider>
          </span>
        </Col>

        <Col className="tab text-right">
          {/* <span stlye={{ position: "absolute", top: "-1em" }}>
            <Button
              secondary
              text="Export"
              onClick={() =>
                printJS({
                  printable: "printJS-user-timesheet",
                  type: "html",
                  targetStyles: ["*"],
                  style: "@page { size: Letter landscape; }",
                })
              }
              icon={<ImportExportRoundedIcon />}
            ></Button>
          </span> */}
        </Col>
      </Row>
      <Row>
        <Col>
          <Row className="get-timesheet">
            <div className="table-time-capture">
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
              {loading ? null : timesheet && timesheet.length > 0 ? (
                <Table striped hover size="sm" id="printJS-user-timesheet">
                  <thead>
                    <tr>
                      <th className="item-head">Item</th>
                      <th className="text-center time-capture-head">
                        {getDay(0)}
                      </th>
                      <th className="text-center time-capture-head">
                        {getDay(1)}
                      </th>
                      <th className="text-center time-capture-head">
                        {getDay(2)}
                      </th>
                      <th className="text-center time-capture-head">
                        {getDay(3)}
                      </th>
                      <th className="text-center time-capture-head">
                        {getDay(4)}
                      </th>
                      <th className="text-center time-capture-head">
                        {getDay(5)}
                      </th>
                      <th className="text-center time-capture-head">
                        {getDay(6)}
                      </th>
                      <th className="text-center time-capture-head">
                        <TimerRoundedIcon />
                      </th>
                    </tr>
                  </thead>

                  <>
                    <tbody>
                      {timesheet.map((item, index) => {
                        return (
                          <tr key={item.id}>
                            <td className="item-text">
                              <div className="center-all justify-content-between">
                                <div className="center-all">
                                  {item.type === "item" ? (
                                    <Tooltip
                                      title={item.group.title}
                                      placement="right"
                                    >
                                      <div
                                        className="group-color"
                                        style={{
                                          backgroundColor: item.group.color,
                                        }}
                                      ></div>
                                    </Tooltip>
                                  ) : (
                                    <div className="absence-color"></div>
                                  )}
                                  <span
                                    className={`item-name ${
                                      item.type === "item" ? `can-click` : null
                                    }`}
                                    onClick={() => {
                                      if (item.type === "item") {
                                        if (item.deleted) {
                                          monday.execute("notice", {
                                            message:
                                              "This item was removed from the board",
                                            type: "error", // or "error" (red), or "info" (blue)
                                            timeout: 4000,
                                          });
                                        } else {
                                          monday.execute("openItemCard", {
                                            itemId: item.id,
                                          });
                                        }
                                      }
                                    }}
                                    style={{
                                      fontStyle: item.deleted
                                        ? "italic"
                                        : "inherit",
                                      textDecoration: item.deleted
                                        ? "line-through"
                                        : "inherit",
                                    }}
                                  >
                                    {item.name}
                                  </span>
                                </div>
                              </div>
                            </td>
                            {/* MONDAY */}
                            <td
                              className="text-center time-capture Mon"
                              tabIndex={1}
                            >
                              <span>{item.timeCaptureForDaysOfWeek[0]}</span>
                            </td>
                            {/* TUESDAY */}
                            <td
                              className="text-center time-capture Tue"
                              tabIndex={2}
                            >
                              <span>{item.timeCaptureForDaysOfWeek[1]}</span>
                            </td>

                            {/* WEDNESDAY */}
                            <td
                              className="text-center time-capture Wed"
                              tabIndex={2}
                            >
                              <span>{item.timeCaptureForDaysOfWeek[2]}</span>
                            </td>
                            {/* THURSDAY */}
                            <td
                              className="text-center time-capture Thu"
                              tabIndex={2}
                            >
                              <span>{item.timeCaptureForDaysOfWeek[3]}</span>
                            </td>
                            {/* FRIDAY */}
                            <td
                              className="text-center time-capture Fri"
                              tabIndex={2}
                            >
                              <span>{item.timeCaptureForDaysOfWeek[4]}</span>
                            </td>
                            {/* SATURDAY */}
                            <td
                              className="text-center time-capture Sat"
                              tabIndex={2}
                            >
                              <span>{item.timeCaptureForDaysOfWeek[5]}</span>
                            </td>
                            {/* SUNDAY */}
                            <td
                              className="text-center time-capture Sun"
                              tabIndex={2}
                            >
                              <span>{item.timeCaptureForDaysOfWeek[6]}</span>
                            </td>
                            <td className="text-center time-capture bold">
                              {getWeekdaySum(item.timeCaptureForDaysOfWeek)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={1}></td>
                        <td
                          className="text-center summary"
                          style={{
                            color: parseFloat(summaries[0]) > 24 ? "red" : "",
                          }}
                        >
                          {parseFloat(summaries[0]).toFixed(2)}
                        </td>
                        <td
                          className="text-center summary"
                          style={{
                            color: parseFloat(summaries[1]) > 24 ? "red" : "",
                          }}
                        >
                          {parseFloat(summaries[1]).toFixed(2)}
                        </td>
                        <td
                          className="text-center summary"
                          style={{
                            color: parseFloat(summaries[2]) > 24 ? "red" : "",
                          }}
                        >
                          {parseFloat(summaries[2]).toFixed(2)}
                        </td>
                        <td
                          className="text-center summary"
                          style={{
                            color: parseFloat(summaries[3]) > 24 ? "red" : "",
                          }}
                        >
                          {parseFloat(summaries[3]).toFixed(2)}
                        </td>
                        <td
                          className="text-center summary"
                          style={{
                            color: parseFloat(summaries[4]) > 24 ? "red" : "",
                          }}
                        >
                          {parseFloat(summaries[4]).toFixed(2)}
                        </td>
                        <td
                          className="text-center summary"
                          style={{
                            color: parseFloat(summaries[5]) > 24 ? "red" : "",
                          }}
                        >
                          {parseFloat(summaries[5]).toFixed(2)}
                        </td>
                        <td
                          className="text-center summary"
                          style={{
                            color: parseFloat(summaries[6]) > 24 ? "red" : "",
                          }}
                        >
                          {parseFloat(summaries[6]).toFixed(2)}
                        </td>
                        <td className="text-center summary">
                          {getWeekdaySum(summaries)}
                        </td>
                      </tr>
                    </tfoot>
                  </>
                </Table>
              ) : (
                <div className="center-all p-4">
                  <span className="m-2 text-text-subtitle-18">
                    No hours were logged during this week
                  </span>
                </div>
              )}
            </div>
          </Row>
        </Col>
      </Row>
    </animated.div>
  );
}

export default UserTimesheet;
