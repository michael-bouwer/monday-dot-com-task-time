import React, { useState, useEffect } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";

//Custom
import queries from "../../api";
import { _currentBoard, _currentTimesheet } from "../../globals/variables";
import "./styles.scss";

function AddItemToTimesheet({ close }) {
  const { loading, error, data } = useQuery(queries.USERS_ITEMS, {
    fetchPolicy: "network-only",
    variables: { ids: _currentBoard() },
  });

  const currentTimesheet = useReactiveVar(_currentTimesheet);
  if (loading) return <p>loading items...</p>;
  if (error) return <p>failed to fetch items</p>;

  return (
    <div
      id="modal-background"
      className="add-items"
      onClick={(e) => {
		  debugger;
        if (e.target.id === "modal-background") {
          return close();
        }
      }}
    >
      <div className="modal">
        <div className="modal-items">
          {data.boards[0].items.map((item) => {
            return (
              <div key={item.id} onClick={() => addToTimesheet(item)}>
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  function addToTimesheet(item) {
    const newItem = {
      id: item.id,
      name: item.name,
      timeCaptureForDaysOfWeek: null,
    };

    let found = false;
    currentTimesheet.map((entry) => {
      if (entry.id === item.id) found = true;
    });

    if (!found) {
      currentTimesheet.push(newItem);
      _currentTimesheet(currentTimesheet);
      console.log(_currentTimesheet());
    }
  }
}

export default AddItemToTimesheet;
