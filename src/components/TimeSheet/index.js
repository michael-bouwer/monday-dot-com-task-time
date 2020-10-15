import React from 'react';
import { useQuery, gql } from "@apollo/client";
import queries from "../../api";
import { _currentUser, _currentBoard } from "../../globals/variables";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

import './styles.scss';

function TimeSheet() {
    const { loading, error, data } = useQuery(queries.USERS_ITEMS, {
        //fetchPolicy: 'network-only',
        variables: { ids: _currentBoard() },
    });

    if (loading) return null;
    if (error) return <p>error</p>;

    return <Row>
        <Col>
            <div className="table-time-capture">
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th className="item-name">Item</th>
                            <th className="text-center time-capture">Mon</th>
                            <th className="text-center time-capture">Tue</th>
                            <th className="text-center time-capture">Wed</th>
                            <th className="text-center time-capture">Thu</th>
                            <th className="text-center time-capture">Fri</th>
                            <th className="text-center time-capture">Sat</th>
                            <th className="text-center time-capture">Sun</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getTimeSheet()}
                        <tr>
                            <td>That one task we did</td>
                            <td className="text-center time-capture"><input></input></td>
                            <td className="text-center time-capture"><input></input></td>
                            <td className="text-center time-capture"><input></input></td>
                            <td className="text-center time-capture"><input></input></td>
                            <td className="text-center time-capture"><input></input></td>
                            <td className="text-center time-capture"><input></input></td>
                            <td className="text-center time-capture"><input></input></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>Total:</td>
                            <td className="text-center">11.8</td>
                        </tr>
                    </tfoot>
                </Table>
            </div>
        </Col>
    </Row>

    // - Private functions
    function getTimeSheet() {
        console.log('time capture');
        let items = [];
        let groups = [];
        data.boards[0].items.map((item, index) => {
            items.push(
                <tr key={item.id}>
                    <td>{item.name}</td>
                    <td className="text-center"><input></input></td>
                    <td className="text-center"><input></input></td>
                    <td className="text-center"><input></input></td>
                    <td className="text-center"><input></input></td>
                    <td className="text-center"><input></input></td>
                    <td className="text-center"><input></input></td>
                    <td className="text-center"><input></input></td>
                </tr>
            );
        });
        return items;
    }
}

export default TimeSheet;