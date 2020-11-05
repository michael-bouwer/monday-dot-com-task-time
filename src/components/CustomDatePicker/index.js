import React, {
  Fragment,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { DatePicker, KeyboardDatePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateRange from "@material-ui/icons/DateRange";
import IconButton from "@material-ui/core/IconButton";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import "./styles.scss";

const CustomDatePicker = forwardRef(({ onClick }, ref) => {
  const [selectedDate, handleDateChange] = useState(moment());
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    setDateFromParentComponent(val) {
      handleDateChange(val);
    },
  }));

  function getDateRange(inputDate) {
    var currentDate = inputDate; //moment();
    var weekStart = currentDate.clone().startOf("isoWeek");
    var weekEnd = currentDate.clone().endOf("isoWeek");
    return weekStart.format("Do MMM") + " - " + weekEnd.format("Do MMM");
  }

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Fragment>
        <div className="center-all justify-content-start">
          <DatePicker
            className="date-picker"
            value={selectedDate}
            labelFunc={() => {
              return getDateRange(moment(selectedDate));
            }}
            onChange={(value) => {
              handleDateChange(value);
              onClick(value);
            }}
            // open={open}
            animateYearScrolling
            showTodayButton
          />
          <div
            style={{
              position: "relative",
              display: "inherit",
              marginLeft: "-1.8em",
            }}
          >
            <DateRange style={{ fill: "white" }} />
          </div>
        </div>

        {/* <KeyboardDatePicker
          clearable={false}
          value={selectedDate}
          labelFunc={() => {
            return getDateRange(moment(selectedDate));
          }}
          onChange={(value) => {
            handleDateChange(value);
            onClick(value);
          }}
          format="MM/dd/yyyy"
          showTodayButton
        /> */}
      </Fragment>
    </MuiPickersUtilsProvider>
  );
});

export default CustomDatePicker;
