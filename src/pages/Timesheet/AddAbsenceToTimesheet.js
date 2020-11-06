import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Box from "@material-ui/core/Box";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

//Custom
import { _currentBoard, _currentTimesheet } from "../../globals/variables";
import Button from "../../components/Button";
import "./styles.scss";

const absenceItems = [
  "Annual Leave",
  "Sick Leave",
  "Unpaid Leave",
  "Family Responsibility Leave",
  "Compassionate Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Other",
];

function AddAbsenceToTimesheet({ close, onSave }) {
  const currentTimesheet = _currentTimesheet();
  const [newTimesheetItems, setTimesheetData] = useState([]);

  return (
    <div
      id="modal-background"
      className="add-items"
      onClick={(e) => {
        if (e.target.id === "modal-background") {
          return close();
        }
      }}
    >
      <Box className="modal">
        <div>
          <span
            className="text-secondary-sub-24"
            style={{ padding: "24px 24px", display: "block" }}
          >
            Select absence to add to your Timesheet.
          </span>
        </div>
        <div className="modal-items">{getListOfItemsNotInTimesheet()}</div>
        <div className="actions">
          <Button small tertiary text="Cancel" onClick={() => close()} />
          <Button
            small
            text="Add to Timesheet"
            onClick={() => {
              onSave([...newTimesheetItems, ...currentTimesheet]);
              save();
            }}
          />
        </div>
      </Box>
    </div>
  );

  function getListOfItemsNotInTimesheet() {
    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          style={{ borderLeft: `8px solid #401694` }}
        >
          <span>Absence</span>
        </AccordionSummary>
        <AccordionDetails style={{ flexDirection: "column" }}>
          {absenceItems.map((item) => {
            let found = false;
            if (currentTimesheet && currentTimesheet.length > 0) {
              currentTimesheet.map((timesheetItem, timesheetIndex) => {
                if (timesheetItem.id === item) {
                  found = true;
                }
              });
            }
            if (!found) {
              return (
                <div
                  key={item}
                  onClick={(e) => {
                    if (alreadyInTimesheet(item)) {
                      e.currentTarget.style.borderLeft = "0px solid gainsboro";
                      e.currentTarget.classList.remove("green");
                      removeFromTimesheet(item);
                    } else {
                      e.currentTarget.style.borderLeft = "8px solid green";
                      e.currentTarget.classList.add("green");
                      addToTimesheet(item);
                    }
                  }}
                  className="item center-all justify-content-start"
                >
                  <span className="tick-text">{item}</span>
                </div>
              );
            }
          })}
        </AccordionDetails>
      </Accordion>
    );
  }

  function addToTimesheet(item) {
    var newItem = {
      id: item,
      name: item,
      group: {
        id: null,
        title: null,
        color: null,
      },
      timeCaptureForDaysOfWeek: [
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
      ],
      type: "absence",
    };

    let found = false;
    newTimesheetItems.map((entry) => {
      if (entry.id === item.id) found = true;
    });

    if (!found) {
      console.log(newItem);
      setTimesheetData([...newTimesheetItems, newItem]);
    }
  }

  function alreadyInTimesheet(item) {
    let found = false;
    newTimesheetItems.map((entry) => {
      if (entry.id === item) {
        found = true;
      }
    });
    if (found) return true;
    return false;
  }

  function removeFromTimesheet(item) {
    let tempArr = newTimesheetItems;
    newTimesheetItems.map((entry, index) => {
      if (entry.id === item) {
        tempArr.splice(index, 1);
      }
    });
    setTimesheetData([...tempArr]);
  }

  function save() {
    _currentTimesheet([...newTimesheetItems, ...currentTimesheet]);
    close();
  }
}

export default AddAbsenceToTimesheet;
