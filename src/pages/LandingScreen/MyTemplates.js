import React from "react";
import { _currentUser, _currentBoard } from "../../globals/variables";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function MyItems() {
  return (
    <div>
      <Row>
        <Col>
          <h4>My Templates</h4>
          <p>Templates to go here</p>
        </Col>
      </Row>
    </div>
  );
}

export default MyItems;
