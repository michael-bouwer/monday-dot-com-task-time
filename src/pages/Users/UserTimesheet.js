import React, { useState, useRef, useEffect } from "react";
import { Col, Row, Table } from "react-bootstrap";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import { useSpring, animated } from "react-spring";
import "./styles.scss";
import { useQuery, useReactiveVar } from "@apollo/client";
import Tooltip from "@material-ui/core/Tooltip";
import AssignmentRoundedIcon from "@material-ui/icons/AssignmentRounded";
import moment from "moment";
import mondaySdk from "monday-sdk-js";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";

//Custom
import queries from "../../api";
import {
  _currentBoard,
  _currentTimesheet,
  _loadingMessages,
} from "../../globals/variables";
import Loading from "../../components/Loading";
import CustomDatePicker from "../../components/CustomDatePicker";
import { setDate } from "date-fns";

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
            <div className="center-all justify-content-start mb-2">
              <IconButton
                style={{ marginLeft: "-16px" }}
                aria-label="upload picture"
                component="span"
                onClick={() => goBack()}
              >
                <ArrowBackRoundedIcon />
              </IconButton>
              <span className="text-secondary-sub-24">{user.name}</span>
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
        const { value, version } = res.data;
        //sleep(10000); // someone may overwrite serialKey during this time
        if (value && value.length > 0) {
          //setTimesheet(JSON.parse(value));
          _currentTimesheet(JSON.parse(value));
          setSummaries(getSums(JSON.parse(value)));
        } else {
          _currentTimesheet([]);
        }
        setLoading(false);
      });
  };

  function getPreviousWeekTimesheet(currentDate) {
    var thisTimeLastWeek = moment(currentDate).subtract(1, "weeks");
    setDate(thisTimeLastWeek);
    getTimesheetForWeek(thisTimeLastWeek);
  }
  function getNextWeekTimesheet(currentDate) {
    var thisTimeNextWeek = moment(currentDate).add(1, "weeks");
    setDate(thisTimeNextWeek);
    getTimesheetForWeek(thisTimeNextWeek);
  }

  function getSums(timesheetObject) {
    let processData = timesheetObject ? timesheetObject : timesheet; //Updating the global timesheet doesn't always happen before sums get calculated.
    let sums = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    if (processData && processData.length > 0) {
      //valid timesheet, calculate sums
      processData.map((item) => {
        item.timeCaptureForDaysOfWeek.map((dayOfWeek, index) => {
          sums[index] += parseFloat(dayOfWeek);
        });
      });
    }
    return sums;
  }

  function getWeekdaySum(dayValues) {
    let sum = 0;
    dayValues.map((value) => {
      sum += parseFloat(value);
    });

    return sum.toFixed(2);
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
          <CustomDatePicker
            style={{ display: "inline-block" }}
            onClick={(value) => {
              setDate(value);
              getTimesheetForWeek(value);
            }}
            value={date}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Row className="get-timesheet">
            <div className="table-time-capture">
              <div className="center-all justify-content-between">
                <ArrowBackIosRoundedIcon
                  onClick={() => {
                    getPreviousWeekTimesheet(date);
                  }}
                  className="arrow"
                />

                <ArrowForwardIosRoundedIcon
                  onClick={() => {
                    getNextWeekTimesheet(date);
                  }}
                  className="arrow"
                />
              </div>
              {loading ? null : timesheet && timesheet.length > 0 ? (
                <Table striped hover size="sm">
                  <thead>
                    <tr>
                      <th className="item-head">Item</th>
                      <th className="text-center time-capture-head">Mon</th>
                      <th className="text-center time-capture-head">Tue</th>
                      <th className="text-center time-capture-head">Wed</th>
                      <th className="text-center time-capture-head">Thu</th>
                      <th className="text-center time-capture-head">Fri</th>
                      <th className="text-center time-capture-head">Sat</th>
                      <th className="text-center time-capture-head">Sun</th>
                      <th className="text-center time-capture-head">
                        <AssignmentRoundedIcon />
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
                                  <span
                                    className="item-name"
                                    onClick={() => {
                                      monday.execute("openItemCard", {
                                        itemId: item.id,
                                      });
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
                            color: parseFloat(summaries[1]) > 24 ? "red" : "",
                          }}
                        >
                          {summaries[0]}
                        </td>
                        <td
                          className="text-center summary"
                          style={{
                            color: parseFloat(summaries[1]) > 24 ? "red" : "",
                          }}
                        >
                          {summaries[1]}
                        </td>
                        <td
                          className="text-center summary"
                          style={{
                            color: parseFloat(summaries[1]) > 24 ? "red" : "",
                          }}
                        >
                          {summaries[2]}
                        </td>
                        <td
                          className="text-center summary"
                          style={{
                            color: parseFloat(summaries[1]) > 24 ? "red" : "",
                          }}
                        >
                          {summaries[3]}
                        </td>
                        <td
                          className="text-center summary"
                          style={{
                            color: parseFloat(summaries[1]) > 24 ? "red" : "",
                          }}
                        >
                          {summaries[4]}
                        </td>
                        <td
                          className="text-center summary"
                          style={{
                            color: parseFloat(summaries[1]) > 24 ? "red" : "",
                          }}
                        >
                          {summaries[5]}
                        </td>
                        <td
                          className="text-center summary"
                          style={{
                            color: parseFloat(summaries[1]) > 24 ? "red" : "",
                          }}
                        >
                          {summaries[6]}
                        </td>
                        <td
                          className="text-center summary"
                          style={{
                            color: parseFloat(summaries[1]) > 24 ? "red" : "",
                          }}
                        >
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
