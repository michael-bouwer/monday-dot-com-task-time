import React, { useState, useEffect } from "react";
import "./styles.scss";
import mondaySdk from "monday-sdk-js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useQuery } from "@apollo/client";
import queries from "../../api";
import { _currentUser, _currentBoard } from "../../globals/variables";
import EditTimeSheet from '../../sections/EditTimeSheet';
const monday = mondaySdk();

const modes = {
	LIST: 0,
	EDIT_TIMESHEET: 1
}

function GroupTimeSheets() {
	const [allTimesheets, setAllTimesheets] = useState(null);
	const [mode, setMode] = useState(modes.LIST);
	const [group, setGroup] = useState({});

	useEffect(() => {
		if (!allTimesheets) {
			getAllTimesheets();
		}
	}, []);

	const getAllTimesheets = async () => {
		await monday.storage.instance.getItem('userId-groupId-yyyyMMdd').then((res) => {
			const { value, version } = res.data;
			console.log(value);
			//sleep(10000); // someone may overwrite serialKey during this time
			if (value && value.length > 0) {
				getAllTimesheets(JSON.parse(value));
			}
		});
	};

	const { loading, error, data } = useQuery(queries.USERS_ITEMS, {
		fetchPolicy: "network-only",
		variables: { ids: _currentBoard() },
	});

	if (loading) {
		return null;
	}
	if (error) return <p>Error :(</p>;

	if (mode === modes.LIST) {
		return (
			<Row>
				<Col>{getGroups()}</Col>
			</Row>
		);
	} else if (mode === modes.EDIT_TIMESHEET) {
		return <EditTimeSheet group={group} />
	}

	function getGroups() {
		let groups = [];
		let groupsUi = [];

		data.boards[0].items.map((item) => {
			if (!groups.includes(item.group.id)) {
				groups.push(item.group.id);
				groupsUi.push(
					<div
						key={item.group.id}
						style={{
							padding: ".5em 1em",
							margin: "10px",
							backgroundColor: "gainsboro",
							borderRadius: "4px",
						}}
						onClick={() => editTimesheet(item.group)}
					>
						{item.group.title}
					</div>
				);
			}
		});
		return groupsUi;
	}

	function editTimesheet(group){
		setGroup(group);
		setMode(modes.EDIT_TIMESHEET);
	}
}

export default GroupTimeSheets;
