import React from "react";
import { useQuery, gql } from "@apollo/client";
import queries from "../../api";
import { _currentUser } from "../../globals/variables";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getInclusionDirectives } from "@apollo/client/utilities";

function MyItems() {
  const { loading, error, data } = useQuery(queries.USERS_ITEMS, {
    variables: { ids: [757616149] },
  });

  if (loading) return <p>loading.</p>;
  if (error) return <p>Error :(</p>;

  const user = _currentUser(data.me.id);

  function getList(data) {
    let items = [];
    data.boards[0].items.map((item) => {
      item.subscribers.map((sub) => {
        if (user === sub.id) {
          console.log(user, sub.id);
          items.push(<p key={item.id}>{item.name}</p>);
        }
      });
    });
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
