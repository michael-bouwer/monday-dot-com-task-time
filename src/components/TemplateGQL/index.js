import React, { useState, useEffect } from "react";
import "./styles.scss";
import mondaySdk from "monday-sdk-js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
const monday = mondaySdk();

function TemplateGQL() {

    if (campaigns && campaigns.length > 0) {
        return (
            <Row>
            </Row>
        );
    } else {
        return (
            <Row>
            </Row>
        );;
    }
}

export default TemplateGQL;
