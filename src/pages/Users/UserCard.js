import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import mondaySdk from "monday-sdk-js";
import moment from "moment";

const monday = mondaySdk();

function UserCard({ user, onClick }) {
  const [hoursToday, setHoursToday] = useState(null);
  const [hoursWeek, setHoursWeek] = useState(null);
  const [userTimesheet, setUserTimesheet] = useState([]);

  function getDateRange(inputDate) {
    var currentDate = inputDate; //moment();
    var weekStart = currentDate.clone().startOf("isoWeek");
    var weekEnd = currentDate.clone().endOf("isoWeek");

    return weekStart.format("yyyyMMDD") + "-" + weekEnd.format("yyyyMMDD");
  }

  const getTimesheetForWeek = async (user) => {
    await monday.storage.instance
      .getItem("timesheet_" + user.id + "_" + getDateRange(moment()))
      .then((res) => {
        const { value, version } = res.data;
        if (value && value.length > 0) {
          let todaySum = 0;
          let weekSum = 0;
          const timesheet = JSON.parse(value);
          if (timesheet && timesheet.length > 0) {
            setUserTimesheet(timesheet);
            timesheet.map((item) => {
              item.timeCaptureForDaysOfWeek.map((dayTime, index) => {
                if (index === 0) {
                  //Monday jsut for testing
                  todaySum += parseFloat(dayTime);
                }
                weekSum += parseFloat(dayTime);
              });
            });
          }
          setHoursToday(todaySum.toFixed(2));
          setHoursWeek(weekSum.toFixed(2));
        } else {
          // do nothing
          setHoursToday(0);
          setHoursWeek(0);
        }
      });
  };

  useEffect(() => {
    getTimesheetForWeek(user);
  }, []);

  return (
    <Col style={{ marginTop: "16px" }}>
      <ButtonBase
        style={{
          display: "unset",
          width: "inherit",
          outline: "none",
          borderRadius: "4px",
        }}
      >
        <div
          className="card"
          onClick={() => {
            onClick(userTimesheet);
          }}
        >
          <Row className="avatar-summary">
            <Col sm={3} className="today">
              <span>TODAY</span>
              <span className="text-paragraph-16" style={{ display: "block" }}>
                {hoursToday === null ? "--" : hoursToday}
              </span>
            </Col>
            <Col sm={6} className="avatar">
              <Avatar
                alt={user.name}
                src={user.photo_original}
                style={{ width: "80px", height: "80px", margin: "16px 0" }}
              />
            </Col>
            <Col sm={3} className="week">
              <span>WEEK</span>
              <span className="text-paragraph-16" style={{ display: "block" }}>
                {hoursWeek === null ? "--" : hoursWeek}
              </span>
            </Col>
          </Row>
          <Row>
            <Col className="user-name">
              <span className="text-paragraph-16">{user.name}</span>
            </Col>
          </Row>
        </div>
      </ButtonBase>
    </Col>
  );
}

export default UserCard;
