import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import queries from "../../api";
import "./styles.scss";
import { _currentUser, _currentBoard } from "../../globals/variables";

//custom
import AddNew from "../../sections/AddNew";
import Existing from "../../sections/Existing";
import Button from "../../components/Button";
import MyItems from "./MyItems";
import MyTemplates from "./MyTemplates";

const _pages = {
  MY_ITEMS: 1,
  MY_TEMPLATES: 2,
};

function LandingScreen() {
  const [currentPage, setPage] = useState(_pages.MY_ITEMS);
  const { loading, error, data } = useQuery(queries.BOARD, {
    variables: { ids: _currentBoard() },
  });

  if (loading) return null;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <div className="header">
        <div className="AddNew center-all">
          {/*<AddNew />*/}
          <Button text="My Items" onClick={(e) => getButtonEvent(e)} />
          <Button text="My Templates" onClick={(e) => getButtonEvent(e)} />
        </div>
        {/*<div className="Existing">
          <Existing />
        </div>*/}
        {getCurrentPage()}
        {/*<h2>{data.boards[0].name}</h2>
        <div className="profile">
          <Tooltip title={data.me.name} placement="left">
            <Avatar
              className="avatar"
              alt={data.me.name}
              src={data.me.photo_original}
            />
          </Tooltip>
        </div>*/}
      </div>
      {/*<MyItems />*/}
    </div>
  );

  function getCurrentPage() {
    if (currentPage === _pages.MY_ITEMS) {
      return <MyItems />;
    } else if (currentPage === _pages.MY_TEMPLATES) {
      return <MyTemplates />;
    }
  }

  function getButtonEvent(e) {
    switch (e.target.innerText) {
      case "My Items":
        setPage(_pages.MY_ITEMS);
        console.log("my items selected");
        break;
      case "My Templates":
        setPage(_pages.MY_TEMPLATES);
        console.log("my templates selected");
        break;
      default:
        setPage(_pages.MY_ITEMS);
        console.log("my items selected");
        break;
    }
  }
}

export default LandingScreen;
