import React, { useState, useEffect } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import mondaySdk from "monday-sdk-js";

//Custom
import queries from "../../api";
import { _currentBoard, _currentTimesheet } from "../../globals/variables";
import Button from "../../components/Button";
import "./styles.scss";
import { Save } from "@material-ui/icons";

const monday = mondaySdk();

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

function AddItemToTimesheet({ close, onSave }) {
  const { loading, error, data } = useQuery(queries.USERS_ITEMS, {
    //fetchPolicy: "network-only",
    variables: { ids: _currentBoard() },
  });

  const currentTimesheet = _currentTimesheet();
  const [newTimesheetItems, setTimesheetData] = useState([]);

  if (loading) return <p>fetching items...</p>;
  if (error) return <p>failed to fetch items</p>;

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
            Select items to add to your Timesheet.
          </span>
        </div>
        <div className="modal-items">{getListOfItemsNotInTimesheet(data)}</div>
        <div className="actions">
          <Button small tertiary text="Cancel" onClick={() => close()} />
          <Button
            small
            text="Add to Timesheet"
            onClick={() => {
              onSave([...currentTimesheet, ...newTimesheetItems]);
              save();
            }}
          />
        </div>
      </Box>
    </div>
  );

  function getListOfItemsNotInTimesheet(fromData) {
    let list = [];
    let filteredItems = fromData.boards[0].items;
    let groups = fromData.boards[0].groups;

    if (filteredItems && filteredItems.length > 0) {
      groups.map((group) => {
        let itemsCount = 0;
        list.push(
          <Accordion key={group.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              key={group.id}
              style={{ borderLeft: `8px solid ${group.color}` }}
            >
              <span>{group.title}</span>
            </AccordionSummary>
            <AccordionDetails style={{ flexDirection: "column" }}>
              {filteredItems.map((item) => {
                let found = false;
                if (currentTimesheet && currentTimesheet.length > 0) {
                  currentTimesheet.map((timesheetItem, timesheetIndex) => {
                    if (timesheetItem.id === item.id) {
                      //filteredItems = filteredItems.splice(index, 1);
                      found = true;
                    }
                  });
                }

                if (item.group.id === group.id && !found) {
                  itemsCount += 1;
                  return (
                    <div
                      key={item.id}
                      onClick={(e) => {
                        if (alreadyInTimesheet(item)) {
                          e.currentTarget.style.borderLeft =
                            "0px solid gainsboro";
                          removeFromTimesheet(item);
                        } else {
                          e.currentTarget.style.borderLeft = "8px solid green";
                          addToTimesheet(item);
                        }
                      }}
                      className="item center-all justify-content-start"
                    >
                      {/* <CheckCircleOutlineRoundedIcon
                        className="tick"
                      /> */}
                      <span className="tick-text">{item.name}</span>
                    </div>
                  );
                }
              })}
            </AccordionDetails>
          </Accordion>
        );
        if (itemsCount === 0) list.pop(); //Remove group from list if there all items are already on the timesheet.
      });
      return list;
    } else {
      monday.execute("notice", {
        message: "There are no items on your board.",
        type: "error", // or "error" (red), or "info" (blue)
        timeout: 4000,
      });
      close();
    }
  }

  function addToTimesheet(item) {
    var newItem = {
      id: item.id,
      name: item.name,
      group: {
        id: item.group.id,
        title: item.group.title,
        color: item.group.color,
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
      if (entry.id === item.id) {
        found = true;
      }
    });
    if (found) return true;
    return false;
  }

  function removeFromTimesheet(item) {
    let tempArr = newTimesheetItems;
    newTimesheetItems.map((entry, index) => {
      if (entry.id === item.id) {
        tempArr.splice(index, 1);
      }
    });
    setTimesheetData([...tempArr]);
  }

  function save() {
    _currentTimesheet([...currentTimesheet, ...newTimesheetItems]);
    close();
  }
}

export default AddItemToTimesheet;
