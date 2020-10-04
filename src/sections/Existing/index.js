import React, { useState, useEffect} from "react";
import "./styles.scss";
import mondaySdk from "monday-sdk-js";
import Row from "react-bootstrap/Row";
const monday = mondaySdk();

function Existing() {
  const [campaigns, setCampaigns] = useState(null);

  useEffect(() => {
    monday.storage.instance.getItem("campaigns").then((res) => {
      const { value, version } = res.data;
      console.log(value);
      //sleep(10000); // someone may overwrite serialKey during this time
      if (value && value.length > 0) {
        setCampaigns(JSON.parse(value));
      }

      //temp
      // monday.storage.instance
      //   .setItem("campaigns", JSON.stringify([{ id: 1, name: "test campaign" }]))
      //   .then((res) => {
      //     console.log(res);
      //   });
    });
    return () => {
      //
    };
  });

  if (campaigns) {
    return (
      <Row className="existing">
        {campaigns.map((campaign) => {
          return (
            <Row>
              <p key={campaign.id}>{campaign.name}</p>
            </Row>
          );
        })}
      </Row>
    );
  } else {
    return null;
  }
}

export default Existing;
