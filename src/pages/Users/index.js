import React from "react";
import "./styles.scss";
import { useQuery, useReactiveVar } from "@apollo/client";
import { Row } from "react-bootstrap";

//Custom
import queries from "../../api";
import { _currentBoard } from "../../globals/variables";
import Loading from "../../components/Loading";
import UserCard from "./UserCard";
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

function Users() {
  const { loading, error, data, refetch } = useQuery(queries.SUBSCRIBERS, {
    fetchPolicy: "network-only",
    variables: { ids: _currentBoard() },
  });

  if (loading) return <Loading text="Looking up board user details" />;
  if (error) return <span>something went wrong :(</span>;

  return (
    <div style={{margin: "0 16px"}}>
      <Row xs={2} md={3} lg={4}>
        {data.boards[0].subscribers.map((user) => {
          return (
            <UserCard
              key={user.id}
              user={user}
              onClick={(timesheet) => {
                if (!timesheet || timesheet.length === 0) {
                  monday.execute("notice", {
                    message: "Nothing to see here.",
                    type: "error", // or "error" (red), or "info" (blue)
                    timeout: 4000,
                  });
                } else {
                  monday.execute("notice", {
                    message: JSON.stringify(timesheet),
                    type: "success", // or "error" (red), or "info" (blue)
                    timeout: 2000,
                  });
                }
              }}
            />
          );
        })}
      </Row>
    </div>
  );
}

export default Users;
