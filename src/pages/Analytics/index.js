import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import { CustomBar, CustomPolar } from "../../components/Charts";
import "./styles.scss";

function Analytics() {
  return (
    <div className="analytics">
      <Row style={{ margin: "0 16px" }}>
        <Col sm={8}>
          <span className="text-subtitle-18 dark-gray analytical-block text-uppercase">
            CHART Here
          </span>
          <div className="card mt-2">
            <CustomBar />
          </div>
        </Col>

        <Col sm={4}>
          <span className="text-subtitle-18 dark-gray analytical-block text-uppercase">
            Pie Here
          </span>
          <div className="card mt-2">
            <CustomPolar />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Analytics;
