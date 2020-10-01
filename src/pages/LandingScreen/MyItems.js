import React from "react";
import { useQuery, gql } from "@apollo/client";
import queries from "../../api";
import { _currentUser, _currentBoard } from "../../globals/variables";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useSpring, animated} from 'react-spring'

function MyItems() {
  const [props, set, stop] = useSpring(() => ({opacity: 0}))
  const { loading, error, data } = useQuery(queries.USERS_ITEMS, {
    variables: { ids: _currentBoard() },
  });

  if (loading) return null;
  if (error) return <p>Error :(</p>;

  const user = _currentUser(data.me.id);

  function getList(data) {
    let items = [];
    data.boards[0].items.map((item, index) => {
      item.subscribers.map((sub) => {
        if (user === sub.id) {
          items.push(<animated.p key={index} style={props}>{item.name}</animated.p>);
        }
      });
    });
    set({opacity: 1});
    stop();
    return items;
  }

  return (
    <div className="my-items">
      <Row>
        <Col>
          <h4>My Items</h4>
          <div className="item-list">{getList(data)}</div>
        </Col>
      </Row>
    </div>
  );
}

export default MyItems;
