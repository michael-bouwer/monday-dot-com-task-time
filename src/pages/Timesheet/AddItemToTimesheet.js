import React, { useState, useEffect } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";

//Custom
import queries from "../../api";
import { _currentBoard, _currentTimesheet } from "../../globals/variables";
import Button from "../../components/Button";
import "./styles.scss";
import { Save } from "@material-ui/icons";

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
        <div className="modal-items">{getListOfItemsNotInTimesheet(data)}</div>
        <div className="actions">
          <Button small tertiary text="Cancel" onClick={() => close()} />
          <Button small text="Save" onClick={() => save()} />
        </div>
      </div>
    </div>
  );

  function getListOfItemsNotInTimesheet(data) {
    let list = [];
    let filteredItems = data.boards[0].items;

    filteredItems.map((item, index) => {
      let found = false;
      if (currentTimesheet && currentTimesheet.length > 0) {
        currentTimesheet.map((timesheetItem) => {
          if (timesheetItem.id === item.id) {
            found = true; //remove item from list because it's already in the timesheet
          } else {
            // remain false
          }
        });
      }
      if(!found){
        list.push(
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
    });
    return list;
  }

  function addToTimesheet(item) {
    const newItem = {
      id: item.id,
      name: item.name,
      group: {
        id: item.group.id,
        title: item.group.title,
        color: item.group.color,
      },
      timeCaptureForDaysOfWeek: null,
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
    var arr = currentTimesheet;
    arr.concat(newTimesheetItems);
    console.log(currentTimesheet, newTimesheetItems, arr);
    _currentTimesheet([...currentTimesheet, ...newTimesheetItems]);
    close();
  }
}

export default AddItemToTimesheet;
