import React, { Component, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { CustomBar, CustomPolar } from "../../components/Charts";
import "./styles.scss";

const dataset = [
  {
    index: 6,
    color: "red",
  },
  {
    index: 2,
    color: "cyan",
  },
  {
    index: 16,
    color: "black",
  },
  {
    index: 4,
    color: "purple",
  },
];

function Analytics() {
  const refn = useRef();
  function getBattery() {
    let avg = 0;
    let sum = 0;

    dataset.forEach((item) => {
      sum += item.index;
    });
    avg = sum / dataset.length;
    let arr = [];
    dataset.forEach((item, index) => {
      let width = (item.index / sum) * 100;
      arr.push(
        <span
          style={{
            height: "100%",
            width: `calc((${width} / 100) * 100%)`,
            backgroundColor: item.color,
          }}
          className="battery-item"
        >
          {item.index}
        </span>
      );
    });
    return arr;
  }

  return (
    <div className="analytics">
      <Row style={{ margin: "0 16px" }}>
        {/* <Col sm={8}>
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
        </Col> */}
        <Col>
          <span className="text-subtitle-18 dark-gray analytical-block text-uppercase">
            Testing SVG Interactions
          </span>
          <div className="card mt-2">
            <div className="center-all" ref={refn} style={{ height: "50px" }}>
              {getBattery()}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Analytics;
