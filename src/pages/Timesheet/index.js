import React, { useState, useEffect, useRef } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { Col, Row, Spinner, Table } from "react-bootstrap";
import "./styles.scss";
import moment from "moment";
import mondaySdk from "monday-sdk-js";

//Custom
import queries from "../../api";
import { _currentBoard, _currentTimesheet } from "../../globals/variables";
import Button from "../../components/Button";
import AddItemToTimeheet from "./AddItemToTimesheet";

const monday = mondaySdk();

function Timesheet() {
  const { loading, error, data } = useQuery(queries.USERS_ITEMS, {
    fetchPolicy: "network-only",
    variables: { ids: _currentBoard() },
  });

  if (loading) return <p>loading...</p>;
  if (error) return <p>error</p>;
  return (
    <div className="timesheet">
      <Row>
        <Col>
          <p className="text-main-32 bold">Timesheet for week:</p>
          <div>
            <p className="text-subtitle-18">{getDateRange()}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row className="get-timesheet">
            <GetTimesheet data={data} />
          </Row>
        </Col>
      </Row>
    </div>
  );
}

function GetTimesheet({ data }) {
  const timesheet = useReactiveVar(_currentTimesheet);
  const [loading, setLoading] = useState(true);
  const [addingItem, isAddingItem] = useState(false);
  const [editingMonday, setEditingMonday] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [summaries, setSummaries] = useState(() => getSums());

  //Grid refs
  const Mon = useRef(null);
  const Tues = useRef(null);

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
        } else {
          _currentTimesheet([]);
          /*var sampleData = [
                                  {
                                      id: 1,
                                      name: "Test 1",
                                      timeCaptureForDaysOfWeek: null
                                  },
                                  {
                                      id: 2,
                                      name: "Test 2",
                                      timeCaptureForDaysOfWeek: null
                                  },
                              ];
                              monday.storage.instance
                                  .setItem("timesheet_" + data.me.id + "_", JSON.stringify(sampleData))
                                  .then((res) => {
                                      console.log(res);
                                  });
                              setTimesheet(sampleData);*/
        }
        setLoading(false);
      });
  };

  function saveTimeItem(time, timeItem, index) {
    debugger;
    let arr = timesheet;
    let sums;
    arr.map((item) => {
      if (item.id === timeItem.id) {
        item.timeCaptureForDaysOfWeek[index] = time;
      }
    });
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
    setSummaries(getSums());
  }

  function getSums() {
    let sums = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    if (timesheet && timesheet.length > 0) {
      //valid timesheet, calculate sums
      timesheet.map((item) => {
        item.timeCaptureForDaysOfWeek.map((dayOfWeek, index) => {
          sums[index] = sums[index] + parseFloat(dayOfWeek);
        });
      });
    }
    return sums;
  }

  useEffect(() => {
    setLoading(true);
    getTimesheetForWeek();
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
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
            <th className="text-center time-capture-head">Aggr.</th>
          </tr>
        </thead>

        {timesheet && timesheet.length > 0 ? (
          <>
            <tbody>
              {timesheet.map((item) => {
                return (
                  <tr key={item.id}>
                    <td className="item-text">
                      <div className="center-all justify-content-between">
                        <div className="center-all">
                          <div
                            className="group-color"
                            style={{ backgroundColor: item.group.color }}
                          ></div>
                          <span>{item.name}</span>
                        </div>
                        <span
                          className="delete"
                          onClick={() => {
                            monday
                              .execute("confirm", {
                                message:
                                  "Are you sure you'd like to remove this item from your timesheet?",
                                confirm: "Let's go!",
                                cancelButton: "No way",
                                excludeCancelButton: false,
                              })
                              .then((res) => {
                                if (res.data.confirm === true) {
                                  removeItemFromTimesheet(item);
                                }
                              });
                          }}
                        >
                          remove
                        </span>
                      </div>
                    </td>
                    <td
                      className="text-center time-capture Mon"
                      onFocus={(e) => {
                        e.target.click();
                      }}
                      onClick={() => {
                        if (!editingMonday) {
                          setEditingMonday(true);
                          setEditingItem(item);
                          setEditingText(item.timeCaptureForDaysOfWeek[0]);
                        }
                      }}
                      tabIndex={1}
                    >
                      {editingMonday === true && editingItem === item ? (
                        <input
                          ref={Mon}
                          className="time-input"
                          value={editingText}
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
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.currentTarget.blur();
                            }
                          }}
                          tabIndex={1}
                        ></input>
                      ) : (
                        <span>{item.timeCaptureForDaysOfWeek[0]}</span>
                      )}
                    </td>
                    <td
                      className="text-center time-capture Tue"
                      tabIndex={2}
                      onBlur={() => console.log("test")}
                    >
                      0.0
                    </td>
                    <td className="text-center time-capture Wed" tabIndex={3}>
                      0.0
                    </td>
                    <td className="text-center time-capture Thu">0.0</td>
                    <td className="text-center time-capture Fri">0.0</td>
                    <td className="text-center time-capture Sat">0.0</td>
                    <td className="text-center time-capture Sun">0.0</td>
                    <td className="text-center time-capture Aggr">0.0</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={1}></td>
                <td className="text-center summary">{summaries[0]}</td>
                <td className="text-center summary">0.0</td>
                <td className="text-center summary">0.0</td>
                <td className="text-center summary">0.0</td>
                <td className="text-center summary">0.0</td>
                <td className="text-center summary">0.0</td>
                <td className="text-center summary">0.0</td>
                <td className="text-center summary">0.0</td>
              </tr>
            </tfoot>
          </>
        ) : null}
      </Table>
      {timesheet && timesheet.length > 0 ? (
        <Button
          medium
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
        <AddItemToTimeheet close={() => isAddingItem(false)} />
      ) : null}
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

export default Timesheet;
