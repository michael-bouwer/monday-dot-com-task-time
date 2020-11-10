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
  const [hasAbsence, setHasAbsence] = useState(null);
  const [absence, setAbsence] = useState(null);

  function getDateRange(inputDate) {
    var currentDate = inputDate; //moment();
    var weekStart = currentDate.clone().startOf("isoWeek");
    var weekEnd = currentDate.clone().endOf("isoWeek");

    return weekStart.format("yyyyMMDD") + "-" + weekEnd.format("yyyyMMDD");
  }

  function getdayOfWeekInt() {
    return moment().day() - 1;
  }

  const getTimesheetForWeek = async (user) => {
    await monday.storage.instance
      .getItem("timesheet_" + user.id + "_" + getDateRange(moment()))
      .then((res) => {
        const { value, version } = res.data;
        if (value && value.length > 0) {
          let todaySum = 0;
          let weekSum = 0;
          let absenceSum = 0;
          const timesheet = JSON.parse(value);
          if (timesheet && timesheet.length > 0) {
            setUserTimesheet(timesheet);
            timesheet.map((item) => {
              if (item.type === "absence") setHasAbsence(true);
              item.timeCaptureForDaysOfWeek.map((dayTime, index) => {
                if (index === getdayOfWeekInt()) {
                  //Monday jsut for testing
                  if (item.type === "absence") {
                    absenceSum += parseFloat(dayTime);
                  } else {
                    todaySum += parseFloat(dayTime);
                  }
                }
                weekSum += parseFloat(dayTime);
              });
            });
          }
          setHoursToday(todaySum.toFixed(2));
          setHoursWeek(weekSum.toFixed(2));
          setAbsence(absenceSum.toFixed(2));
        } else {
          // do nothing
          setHoursToday((0).toFixed(2));
          setHoursWeek((0).toFixed(2));
          setAbsence((0).toFixed(2));
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
            <Col
              sm={3}
              style={{
                padding: "16px",
                margin: "0",
                backgroundColor: "#292F4C",
                borderRadius: "4px 0 0 4px",
                color: "white",
              }}
            >
              <Row className="today center-all flex flex-column">
                {/* TODAY */}
                <span>TODAY</span>
                <span className="text-paragraph-16 mb-2">
                  {hoursToday === null || parseFloat(hoursToday) === 0
                    ? "--"
                    : hoursToday}
                </span>
                {/* WEEK */}
                <span>WEEK</span>
                <span className="text-paragraph-16 mb-2">
                  {hoursWeek === null || parseFloat(hoursWeek) === 0
                    ? "--"
                    : hoursWeek}
                </span>
                <span
                  className="text-center"
                  style={{ opacity: hasAbsence ? "1" : "0" }}
                >
                  ABSENCE
                </span>
                <span
                  className="text-paragraph-16"
                  style={{ opacity: hasAbsence ? "1" : "0" }}
                >
                  {absence === null || parseFloat(absence) === 0
                    ? "--"
                    : absence}
                </span>
              </Row>
            </Col>
            <Col sm={9} style={{ padding: "16px" }}>
              <Row className="center-all h-100 flex-column justify-content-center">
                <Avatar
                  alt={user.name}
                  src={user.photo_original}
                  style={{ width: "80px", height: "80px" }}
                />
                <div className="user-name mt-4">
                  <span className="text-paragraph-16">{user.name}</span>
                </div>
              </Row>
            </Col>
          </Row>
        </div>
      </ButtonBase>
    </Col>
  );
}

export default UserCard;
