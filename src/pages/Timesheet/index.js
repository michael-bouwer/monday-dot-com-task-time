import React, { useState, useEffect, useRef } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { Col, Row, Table } from "react-bootstrap";
import Tooltip from "@material-ui/core/Tooltip";
import AssignmentRoundedIcon from "@material-ui/icons/AssignmentRounded";
import "./styles.scss";
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
import Button from "../../components/Button";
import AddItemToTimeheet from "./AddItemToTimesheet";
import Loading from "../../components/Loading";

const monday = mondaySdk();

function Timesheet() {
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

  const getTimesheetForWeek = async () => {
    await monday.storage.instance
      .getItem("timesheet_" + data.me.id + "_")
      .then((res) => {
        const { value, version } = res.data;
        console.log(value);
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

  const saveTimesheetForWeek = async (timesheet) => {
    await monday.storage.instance
      .setItem("timesheet_" + data.me.id + "_", JSON.stringify(timesheet))
      .then((res) => {
        console.log(res);
      });
  };

  function saveTimeItem(time, timeItem, index) {
    let arr = timesheet;
    let sums;
    arr.map((item) => {
      if (item.id === timeItem.id) {
        item.timeCaptureForDaysOfWeek[index] = parseFloat(time).toFixed(2);
      }
    });
    saveTimesheetForWeek(arr);
    _currentTimesheet(arr);
    setSummaries(getSums());
  }

  function removeItemFromTimesheet(itemToDelete) {
    let arr = timesheet;
    arr.map((item, index) => {
      if (item.id === itemToDelete.id) {
        arr.splice(index, 1);
      }
    });
    _currentTimesheet(null); //for some reason, setting a Reactive Var as an array doesn't immediately trigger an update.
    _currentTimesheet(arr); //there fore, setting it to NULL then assign array forces a re-render.
    saveTimesheetForWeek(arr);
    setSummaries(getSums());
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
    <div className="timesheet">
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
                                <span
                                  className="delete"
                                  onClick={() => {
                                    monday
                                      .execute("confirm", {
                                        message:
                                          "Are you sure you'd like to remove this item from your timesheet?",
                                        confirmButton: "Yes!",
                                        cancelButton: "No way",
                                        excludeCancelButton: false,
                                      })
                                      .then((res) => {
                                        if (res.data.confirm === true) {
                                          removeItemFromTimesheet(item);
                                          monday.execute("notice", {
                                            message: "Item removed.",
                                            type: "success", // or "error" (red), or "info" (blue)
                                            timeout: 4000,
                                          });
                                        }
                                      });
                                  }}
                                >
                                  remove
                                </span>
                              </div>
                            </td>
                            {/* MONDAY */}
                            <td
                              className="text-center time-capture Mon"
                              onFocus={(e) => {
                                e.target.click();
                              }}
                              onClick={() => {
                                if (!editingMonday) {
                                  setEditingMonday(true);
                                  setEditingItem(item);
                                  setEditingText(
                                    item.timeCaptureForDaysOfWeek[0]
                                  );
                                }
                              }}
                              tabIndex={1}
                            >
                              {editingMonday === true &&
                              editingItem === item ? (
                                <IMaskInput
                                  mask={Number}
                                  radix="."
                                  ref={Mon}
                                  className="time-input"
                                  value={editingText.toString()}
                                  onBlur={() => {
                                    saveTimeItem(editingText, item, 0);
                                    setEditingMonday(false);
                                    setEditingItem(null);
                                    setEditingText("");
                                  }}
                                  onFocus={(e) => {
                                    e.target.select();
                                  }}
                                  autoFocus
                                  onAccept={(value, mask) =>
                                    setEditingText(value)
                                  }
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      e.currentTarget.blur();
                                    }
                                  }}
                                  tabIndex={1}
                                ></IMaskInput>
                              ) : (
                                <span>{item.timeCaptureForDaysOfWeek[0]}</span>
                              )}
                            </td>
                            {/* TUESDAY */}
                            <td
                              className="text-center time-capture Tue"
                              onFocus={(e) => {
                                e.target.click();
                              }}
                              onClick={() => {
                                if (!editingTuesday) {
                                  setEditingTuesday(true);
                                  setEditingItem(item);
                                  setEditingText(
                                    item.timeCaptureForDaysOfWeek[1]
                                  );
                                }
                              }}
                              tabIndex={2}
                            >
                              {editingTuesday === true &&
                              editingItem === item ? (
                                <IMaskInput
                                  mask={Number}
                                  radix="."
                                  ref={Tues}
                                  className="time-input"
                                  value={editingText.toString()}
                                  onBlur={() => {
                                    saveTimeItem(editingText, item, 1);
                                    setEditingTuesday(false);
                                    setEditingItem(null);
                                    setEditingText("");
                                  }}
                                  onFocus={(e) => {
                                    e.target.select();
                                  }}
                                  autoFocus
                                  onAccept={(value, mask) =>
                                    setEditingText(value)
                                  }
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      e.currentTarget.blur();
                                    }
                                  }}
                                  tabIndex={2}
                                ></IMaskInput>
                              ) : (
                                <span>{item.timeCaptureForDaysOfWeek[1]}</span>
                              )}
                            </td>

                            {/* To be replaced with Imasks once perfected */}
                            <td className="text-center time-capture Wed">
                              0.0
                            </td>
                            <td className="text-center time-capture Thu">
                              0.0
                            </td>
                            <td className="text-center time-capture Fri">
                              0.0
                            </td>
                            <td className="text-center time-capture Sat">
                              0.0
                            </td>
                            <td className="text-center time-capture Sun">
                              0.0
                            </td>
                            <td className="text-center time-capture Aggr">
                              {getWeekdaySum(item.timeCaptureForDaysOfWeek)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={1}></td>
                        <Tooltip
                          title="There are only 24 hours in a day!"
                          placement="bottom"
                          disableHoverListener={
                            parseFloat(summaries[0]) > 24 ? false : true
                          }
                        >
                          <td
                            className="text-center summary"
                            style={{
                              color: parseFloat(summaries[0]) > 24 ? "red" : "",
                            }} //mark value red - totals hours for 1 day cannot exceed 24.
                          >
                            {summaries[0]}
                          </td>
                        </Tooltip>
                        <Tooltip
                          title="There are only 24 hours in a day!"
                          placement="bottom"
                          disableHoverListener={
                            parseFloat(summaries[1]) > 24 ? false : true
                          }
                        >
                          <td
                            className="text-center summary"
                            style={{
                              color: parseFloat(summaries[1]) > 24 ? "red" : "",
                            }} //mark value red - totals hours for 1 day cannot exceed 24.
                          >
                            {summaries[1]}
                          </td>
                        </Tooltip>
                        <Tooltip
                          title="There are only 24 hours in a day!"
                          placement="bottom"
                          disableHoverListener={
                            parseFloat(summaries[2]) > 24 ? false : true
                          }
                        >
                          <td
                            className="text-center summary"
                            style={{
                              color: parseFloat(summaries[2]) > 24 ? "red" : "",
                            }} //mark value red - totals hours for 1 day cannot exceed 24.
                          >
                            {summaries[2]}
                          </td>
                        </Tooltip>
                        <Tooltip
                          title="There are only 24 hours in a day!"
                          placement="bottom"
                          disableHoverListener={
                            parseFloat(summaries[3]) > 24 ? false : true
                          }
                        >
                          <td
                            className="text-center summary"
                            style={{
                              color: parseFloat(summaries[3]) > 24 ? "red" : "",
                            }} //mark value red - totals hours for 1 day cannot exceed 24.
                          >
                            {summaries[3]}
                          </td>
                        </Tooltip>
                        <Tooltip
                          title="There are only 24 hours in a day!"
                          placement="bottom"
                          disableHoverListener={
                            parseFloat(summaries[4]) > 24 ? false : true
                          }
                        >
                          <td
                            className="text-center summary"
                            style={{
                              color: parseFloat(summaries[4]) > 24 ? "red" : "",
                            }} //mark value red - totals hours for 1 day cannot exceed 24.
                          >
                            {summaries[4]}
                          </td>
                        </Tooltip>
                        <Tooltip
                          title="There are only 24 hours in a day!"
                          placement="bottom"
                          disableHoverListener={
                            parseFloat(summaries[5]) > 24 ? false : true
                          }
                        >
                          <td
                            className="text-center summary"
                            style={{
                              color: parseFloat(summaries[5]) > 24 ? "red" : "",
                            }} //mark value red - totals hours for 1 day cannot exceed 24.
                          >
                            {summaries[5]}
                          </td>
                        </Tooltip>
                        <Tooltip
                          title="There are only 24 hours in a day!"
                          placement="bottom"
                          disableHoverListener={
                            parseFloat(summaries[6]) > 24 ? false : true
                          }
                        >
                          <td
                            className="text-center summary"
                            style={{
                              color: parseFloat(summaries[6]) > 24 ? "red" : "",
                            }} //mark value red - totals hours for 1 day cannot exceed 24.
                          >
                            {summaries[6]}
                          </td>
                        </Tooltip>
                        <td className="text-center summary">
                          {getWeekdaySum(summaries)}
                        </td>
                      </tr>
                    </tfoot>
                  </>
                ) : null}
              </Table>
              {timesheet && timesheet.length > 0 ? (
                <Button
                  text="Add Item"
                  onClick={() => isAddingItem(!addingItem)}
                />
              ) : (
                <div
                  className="text-subtitle-18 center-all"
                  style={{ flexDirection: "column", marginTop: "100px" }}
                >
                  <div style={{ marginBottom: "16px" }}>
                    <span>
                      Begin by <strong>adding items</strong> to the{" "}
                      <strong>timesheet.</strong>
                    </span>
                  </div>
                  <div>
                    <Button
                      large
                      text="Add Item"
                      onClick={() => isAddingItem(!addingItem)}
                    />
                  </div>
                </div>
              )}

              {/* Add item to timesheet */}
              {addingItem ? (
                <AddItemToTimeheet
                  onSave={(tempTimesheet) => {
                    saveTimesheetForWeek(tempTimesheet);
                  }}
                  close={() => {
                    isAddingItem(false);
                  }}
                />
              ) : null}
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Timesheet;
