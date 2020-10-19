import React, { useState, useEffect } from "react";
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

  const timesheet = useReactiveVar(_currentTimesheet);
  const [temp, setTemp] = useState(0);

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
          <Row className="get-timesheet" key={timesheet}>
            <GetTimesheet data={data} />
          </Row>
          {/* <Button
            large
            onClick={() => _currentTimesheet(moment().format("HH:mm:ss"))}
            text="Fake New Data"
          ></Button>
          <p style={{ fontSize: "10px" }}>
            Click to show new component where items can be added and removed
            from current worksheet
          </p>

          <br />
                    <br />
                    <div>{temp}</div>
                    <Button
                        text="Add"
                        onClick={() => {
                            setTemp(temp + 1);
                        }}
                    ></Button>
                    <Button
                        text="Save"
                        onClick={() => {
                            _currentTimesheet(temp);
                            setTemp(0);
                        }}
                    ></Button> */}
        </Col>
      </Row>
    </div>
  );
}

function GetTimesheet({ data }) {
  const timesheet = useReactiveVar(_currentTimesheet);
  const [loading, setLoading] = useState(true);
  const [addingItem, isAddingItem] = useState(false);

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

  useEffect(() => {
    setLoading(true);
    getTimesheetForWeek();
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="table-time-capture">
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th className="item-name">Item</th>
            <th className="text-center time-capture">Mon</th>
            <th className="text-center time-capture">Tue</th>
            <th className="text-center time-capture">Wed</th>
            <th className="text-center time-capture">Thu</th>
            <th className="text-center time-capture">Fri</th>
            <th className="text-center time-capture">Sat</th>
            <th className="text-center time-capture">Sun</th>
            <th className="text-center time-capture">Aggr.</th>
          </tr>
        </thead>

        {timesheet && timesheet.length > 0 ? (
          <>
            <tbody>
              {timesheet.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td className="text-center time-capture">0.0</td>
                    <td className="text-center time-capture">0.0</td>
                    <td className="text-center time-capture">0.0</td>
                    <td className="text-center time-capture">0.0</td>
                    <td className="text-center time-capture">0.0</td>
                    <td className="text-center time-capture">0.0</td>
                    <td className="text-center time-capture">0.0</td>
                    <td className="text-center time-capture">0.0</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={8}></td>
                <td className="text-center">0.0</td>
              </tr>
            </tfoot>
          </>
        ) : (
          <tbody>
            <tr>
              <td colSpan={9}>
                <p>no items</p>
              </td>
            </tr>
          </tbody>
        )}
      </Table>
      <Button
        medium
        text="Add Item"
        onClick={() => isAddingItem(!addingItem)}
      />

      {/* Add item to timesheet */}
      {addingItem ? <AddItemToTimeheet close={() => isAddingItem(false)} /> : null}
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
