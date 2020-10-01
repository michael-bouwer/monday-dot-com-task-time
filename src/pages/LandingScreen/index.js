import React from "react";
import { useQuery, gql } from "@apollo/client";
import queries from "../../api";
import "./styles.scss";

import MyItems from "./MyItems";
import { _currentUser } from "../../globals/variables";

import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";

function LandingScreen() {
  const { loading, error, data } = useQuery(queries.BOARD_NAME, {
    variables: { ids: [757616149] },
  });

  if (loading) return null;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <div className="header">
        <p>{data.boards[0].name}</p>
        <CurrentUser />
      </div>
      <MyItems />
    </div>
  );
}

function CurrentUser() {
  const { loading, error, data } = useQuery(queries.CURRENT_USER);

  if (loading) return null;
  if (error) return <p>Error :(</p>;

  _currentUser(data.me);

  return (
    <div className="profile">
      <Tooltip title={data.me.name} placement="left">
        <Avatar
          className="avatar"
          alt={data.me.name}
          src={data.me.photo_original}
        />
      </Tooltip>
    </div>
  );
}

export default LandingScreen;
