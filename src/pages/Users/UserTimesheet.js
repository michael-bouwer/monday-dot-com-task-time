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
import { IMaskInput } from "react-imask";

//Custom
import queries from "../../api";
import {
  _currentBoard,
  _currentTimesheet,
  _loadingMessages,
} from "../../globals/variables";
import Loading from "../../components/Loading";

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
            <div className="center-all justify-content-start">
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
        <Row>
          <Col className="center-all font-italic">
            <span className="text-subtitle-18 mr-2 mt-2">Timesheet for: </span>
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
  return <GetTimesheet data={data} />;
}

function GetTimesheet({ data }) {
  const timesheet = useReactiveVar(_currentTimesheet);
  const [loading, setLoading] = useState(true);
  const [addingItem, isAddingItem] = useState(false);
  const [editingMonday, setEditingMonday] = useState(false);
  const [editingTuesday, setEditingTuesday] = useState(false);
  const [editingWednesday, setEditingWednesday] = useState(false);
  const [editingThursday, setEditingThursday] = useState(false);
  const [editingFriday, setEditingFriday] = useState(false);
  const [editingSaturday, setEditingSaturday] = useState(false);
  const [editingSunday, setEditingSunday] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [summaries, setSummaries] = useState(() => getSums());

  //Grid refs
  const Mon = useRef(null);
  const Tues = useRef(null);
  const Wed = useRef(null);
  const Thu = useRef(null);
  const Fri = useRef(null);
  const Sat = useRef(null);
  const Sun = useRef(null);

  const props = useSpring({
    to: { opacity: 1, marginTop: 0 },
    from: { opacity: 0, marginTop: 64 },
  });

  const getTimesheetForWeek = async () => {
    await monday.storage.instance
      .getItem("timesheet_" + data.me.id + "_")
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
    getTimesheetForWeek();
  }, []);

  if (loading)
    return (
      <Loading
        text={
          _loadingMessages[Math.floor(Math.random() * _loadingMessages.length)]
        }
      />
    );

  return (
    <animated.div className="timesheet" style={props}>
      <Row>
        <Col>
          <Row className="get-timesheet">
            <div className="table-time-capture">
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

                {timesheet && timesheet.length > 0 ? (
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
                        <td className="text-center summary">{summaries[0]}</td>
                        <td className="text-center summary">{summaries[1]}</td>
                        <td className="text-center summary">{summaries[2]}</td>
                        <td className="text-center summary">{summaries[3]}</td>
                        <td className="text-center summary">{summaries[4]}</td>
                        <td className="text-center summary">{summaries[5]}</td>
                        <td className="text-center summary">{summaries[6]}</td>
                        <td className="text-center summary">
                          {getWeekdaySum(summaries)}
                        </td>
                      </tr>
                    </tfoot>
                  </>
                ) : null}
              </Table>
            </div>
          </Row>
        </Col>
      </Row>
    </animated.div>
  );
}

export default UserTimesheet;
