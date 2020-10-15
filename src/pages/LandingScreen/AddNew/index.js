import React from "react";
import Button from "../../../components/Button";
import "./styles.scss";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function AddNew() {
  console.log("add new");
  return (
    <Row className="add-new">
      <Col>
        <p className="text text-title-24">
          Add a new <strong>campaign</strong>, <strong>project</strong> or{" "}
          <strong>event</strong>.
        </p>
        <Button large text="Add New" />
      </Col>
    </Row>
  );
}

export default AddNew;
