import React, { useState } from "react";
import "./styles.scss";
import { useQuery, useReactiveVar } from "@apollo/client";
import { Row } from "react-bootstrap";
import { useTransition, animated } from "react-spring";

//Custom
import queries from "../../api";
import { _currentBoard } from "../../globals/variables";
import Loading from "../../components/Loading";
import UserCard from "./UserCard";
import UserTimesheet from "./UserTimesheet";
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

function Users() {
  const { loading, error, data, refetch } = useQuery(queries.SUBSCRIBERS, {
    fetchPolicy: "network-only",
    variables: { ids: _currentBoard() },
  });

  if (loading) return <Loading text="Looking up board user details" />;
  if (error) return <span>something went wrong :(</span>;

  return <Data data={data} />;
}

function Data({ data }) {
  const [viewUserTimesheet, setViewUserTimesheet] = useState(false);
  const [user, setUser] = useState(null);
  const transitions = useTransition(
    data.boards[0].subscribers,
    (item) => item.id,
    {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
    }
  );
  return (
    <div style={{ margin: "0 16px" }}>
      {viewUserTimesheet ? (
        <UserTimesheet
          user={user}
          goBack={() => {
            setViewUserTimesheet(null);
            setUser(null);
          }}
        />
      ) : (
        <Row xs={2} md={3} lg={4}>
          {transitions.map(({ item, props, key }) => {
            return (
              <animated.div key={key} style={props}>
                <UserCard
                  user={item}
                  onClick={(timesheet) => {
                    if (!timesheet || timesheet.length === 0) {
                      // monday.execute("notice", {
                      //   message: "Nothing to see here.",
                      //   type: "error", // or "error" (red), or "info" (blue)
                      //   timeout: 4000,
                      // });
                    } else {
                      // monday.execute("notice", {
                      //   message: JSON.stringify(timesheet),
                      //   type: "success", // or "error" (red), or "info" (blue)
                      //   timeout: 2000,
                      // });
                    }
                    setUser(item);
                    setViewUserTimesheet(true);
                  }}
                />
              </animated.div>
            );
          })}
        </Row>
      )}
    </div>
  );
}

export default Users;
