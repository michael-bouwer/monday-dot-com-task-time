import React from "react";
import { useQuery } from "@apollo/client";
import queries from "../../api";
import "./styles.scss";
import { _currentUser, _currentBoard } from "../../globals/variables";

//custom
import AddNew from "../../sections/AddNew";
import Existing from "../../sections/Existing";

function LandingScreen() {
  const { loading, error, data } = useQuery(queries.BOARD, {
    variables: { ids: _currentBoard() },
  });

  if (loading) return null;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <div className="header">
        <div className="AddNew center-all">
          <AddNew />
        </div>
        <div className="Existing">
          <Existing />
        </div>
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
}

export default LandingScreen;
