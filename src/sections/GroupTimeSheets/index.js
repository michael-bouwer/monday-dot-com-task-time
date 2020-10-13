import React, { useState, useEffect } from "react";
import "./styles.scss";
import mondaySdk from "monday-sdk-js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useQuery } from "@apollo/client";
import queries from "../../api";
import { _currentUser, _currentBoard } from "../../globals/variables";
const monday = mondaySdk();

function GroupTimeSheets() {
    const { loading, error, data } = useQuery(queries.USERS_ITEMS, {
        fetchPolicy: 'network-only',
        variables: { ids: _currentBoard() },
    });

    if (loading) {
        return null;
    }
    if (error) return <p>Error :(</p>;

    return (
        <Row>
            <Col>{getGroups()}</Col>
        </Row>
    )

    function getGroups() {
        let groups = [];
        let groupsUi = [];

        data.boards[0].items.map((item) => {
            if (!groups.includes(item.group.id)) {
                groups.push(item.group.id);
                groupsUi.push(<div key={item.group.id} style={{ padding: "1.4em 1em", margin: "10px", backgroundColor: "gainsboro", borderRadius: "1em" }}>{item.group.title}</div>)
            };
        })

        return groupsUi;
    }
}

export default GroupTimeSheets;
