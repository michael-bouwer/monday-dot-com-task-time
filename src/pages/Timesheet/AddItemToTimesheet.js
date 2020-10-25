import React, { useState, useEffect } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

//Custom
import queries from "../../api";
import { _currentBoard, _currentTimesheet } from "../../globals/variables";
import Button from "../../components/Button";
import "./styles.scss";
import { Save } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

function AddItemToTimesheet({ close }) {
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
      <div className="modal">
        <div>
          <span className="text-secondary-sub-24">
            Select items to add to your Timesheet.
          </span>
        </div>
        <div className="modal-items">{getListOfItemsNotInTimesheet(data)}</div>
        <div className="actions">
          <Button small tertiary text="Cancel" onClick={() => close()} />
          <Button small text="Add to Timesheet" onClick={() => save()} />
        </div>
      </div>
    </div>
  );

  function getListOfItemsNotInTimesheet(fromData) {
    let list = [];
    let filteredItems = fromData.boards[0].items;
    let groups = fromData.boards[0].groups;

    groups.map((group) => {
      list.push(
        <Accordion key={group.id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            key={group.id}
            style={{ borderLeft: `8px solid ${group.color}` }}
          >
            {group.title}
          </AccordionSummary>
          <AccordionDetails
            style={{ flexDirection: "column", backgroundColor: "#fafafa" }}
          >
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
                return (
                  <div
                    key={item.id}
                    onClick={(e) => {
                      e.currentTarget.style.backgroundColor = "lightblue";
                      addToTimesheet(item);
                    }}
                    className="item"
                  >
                    <span>{item.name}</span>
                  </div>
                );
              }
            })}
          </AccordionDetails>
        </Accordion>
      );
    });
    return list;
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
      timeCaptureForDaysOfWeek: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
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

  function save() {
    _currentTimesheet([...currentTimesheet, ...newTimesheetItems]);
    close();
  }
}

export default AddItemToTimesheet;
