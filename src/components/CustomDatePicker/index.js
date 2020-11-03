import React, { Fragment, useState } from "react";
import { DatePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import "./styles.scss";

function CustomDatePicker({ onClick }) {
  const [selectedDate, handleDateChange] = useState(new Date());

  function getDateRange(inputDate) {
    var currentDate = inputDate; //moment();
    var weekStart = currentDate.clone().startOf("isoWeek");
    var weekEnd = currentDate.clone().endOf("isoWeek");

    return weekStart.format("Do MMM") + " - " + weekEnd.format("Do MMM");
  }

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Fragment>
        <DatePicker
          value={selectedDate}
          labelFunc={() => {
            return getDateRange(moment(selectedDate));
          }}
          onChange={(value) => {
            handleDateChange(value);
            onClick(value);
          }}
          animateYearScrolling
          showTodayButton
        />
      </Fragment>
    </MuiPickersUtilsProvider>
  );
}

export default CustomDatePicker;
