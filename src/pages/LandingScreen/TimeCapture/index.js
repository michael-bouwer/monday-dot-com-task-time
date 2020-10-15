import React from "react";
import { useQuery, gql } from "@apollo/client";
import queries from "../../../api";
import { _currentUser, _currentBoard } from "../../../globals/variables";
import Table from "react-bootstrap/Table";
import "./styles.scss";

function TimeCatpure() {
	const { loading, error, data } = useQuery(queries.USERS_ITEMS, {
		fetchPolicy: 'network-only',
		variables: { ids: _currentBoard() },
	});

	function getList() {
		console.log('time capture');
		let items = [];
		let groups = [];
		data.boards[0].items.map((item, index) => {
			items.push(
				<tr key={item.id}>
					<td>{item.name}</td>
					<td className="text-center">-</td>
				</tr>
			);
		});
		return items;
	}

	if (loading) {
		return null;
	}
	if (error) return <p>Error :(</p>;

	return (
		<div className="table-time-capture">
			<Table striped bordered hover size="sm">
				<thead>
					<tr>
						<th className="item-name">Item</th>
						<th className="text-center time-capture">Time (Hours)</th>
					</tr>
				</thead>
				<tbody>
					{getList()}
					<tr>
						<td>That one task we did</td>
						<td className="text-center">6.5</td>
					</tr>
					<tr>
						<td>Completing another task</td>
						<td className="text-center">5.3</td>
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
	);
}

export default TimeCatpure;
