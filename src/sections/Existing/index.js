import React, { useState, useEffect } from "react";
import "./styles.scss";
import mondaySdk from "monday-sdk-js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
const monday = mondaySdk();

let initialState = [];
monday.storage.instance.getItem("campaigns").then((res) => {
  const { value, version } = res.data;
  console.log(value);
  //sleep(10000); // someone may overwrite serialKey during this time
  if (value && value.length > 0) {
    initialState = JSON.parse(value);
  } else {
    //temp
    var exampleData = [
      { id: 1, name: "Marketing Campaign Example" },
      { id: 2, name: "Restuarant Launch Example" },
    ];
    monday.storage.instance
      .setItem("campaigns", JSON.stringify(exampleData))
      .then((res) => {
        console.log(res);
      });
    initialState = exampleData;
  }
});

function Existing() {
  const [campaigns, setCampaigns] = useState(initialState);

  if (campaigns.length > 0) {
    return (
      <Row className="existing">
        <Col>
          {campaigns.map((campaign) => {
            return (
              <Row>
                <p key={campaign.id}>{campaign.name}</p>
              </Row>
            );
          })}
        </Col>
      </Row>
    );
  } else {
    return null;
  }
}

export default Existing;
