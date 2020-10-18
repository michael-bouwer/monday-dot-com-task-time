import React, { useState, useEffect } from 'react';
import { useQuery, useReactiveVar } from "@apollo/client";
import queries from "../../api";
import { _currentBoard, _currentTimesheet } from "../../globals/variables";
import { Col, Row, Spinner } from 'react-bootstrap';
import Button from '../../components/Button';
import './styles.scss';
import moment from 'moment';
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

function Timesheet() {
    const { loading, error, data } = useQuery(queries.USERS_ITEMS, {
        fetchPolicy: 'network-only',
        variables: { ids: _currentBoard() },
    });

    const timesheet = useReactiveVar(_currentTimesheet);
    const [temp, setTemp] = useState(0);

    if (loading) return <p>loading...</p>;
    if (error) return <p>error</p>;
    return <div className="timesheet">
        <Row>
            <Col>
                <p className="text-main-32 bold">Timesheet for week:</p>
                <div>
                    <p className="text-subtitle-18">{getDateRange()}</p>
                </div>
            </Col>
        </Row>
        <Row>
            <Col>
                <Row className="get-timesheet">
                    <GetTimesheet key={timesheet} data={data} />
                </Row>
                <div>{timesheet}</div>
                <Button large onClick={() => _currentTimesheet(moment().format('HH:mm:ss'))} text="Fake New Data"></Button>
                <p style={{ fontSize: "10px" }}>Click to show new component where items can be added and removed from current worksheet</p>

                <br />
                <br />
                <div>{temp}</div>
                <Button text="Add" onClick={() => {
                    setTemp(temp + 1);
                }}></Button>
                <Button text="Save" onClick={() => {
                    _currentTimesheet(temp);
                    setTemp(0);
                }}></Button>
            </Col>
        </Row>
    </div>
}

function GetTimesheet({ data }) {
    const [timesheet, setTimesheet] = useState(null);
    const [loading, setLoading] = useState(true);

    const getTimesheetForWeek = async () => {
        await monday.storage.instance
            .getItem("timesheet_" + data.me.id + "_")
            .then((res) => {
                const { value, version } = res.data;
                console.log(value);
                //sleep(10000); // someone may overwrite serialKey during this time
                if (value && value.length > 0) {
                    setTimesheet(JSON.parse(value));
                    _currentTimesheet(JSON.parse(value));
                } else {
                    /*var sampleData = [
                        {
                            id: 1,
                            name: "Test 1",
                            timeCaptureForDaysOfWeek: null
                        },
                        {
                            id: 2,
                            name: "Test 2",
                            timeCaptureForDaysOfWeek: null
                        },
                    ];
                    monday.storage.instance
                        .setItem("timesheet_" + data.me.id + "_", JSON.stringify(sampleData))
                        .then((res) => {
                            console.log(res);
                        });
                    setTimesheet(sampleData);*/
                }
                setLoading(false);
            });
    };

    useEffect(() => {
        setLoading(true);
        getTimesheetForWeek();
    }, [])

    if (loading) return <Spinner animation="border" />;
    if (timesheet) {
        return (<div>{timesheet.map((item) => {
            return <div key={item.id}>{item.name}</div>
        })}</div>)

    }
    return <p>no timesheet for this period</p>;

}

function getDateRange(inputDate) {
    var currentDate = moment();
    var weekStart = currentDate.clone().startOf('isoWeek');
    var weekEnd = currentDate.clone().endOf('isoWeek');

    return weekStart.format('Do MMM') + ' - ' + weekEnd.format('Do MMM') + ' (Monday - Sunday)';
}


export default Timesheet;