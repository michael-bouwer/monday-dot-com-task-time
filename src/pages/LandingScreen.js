import React from "react";
import { useQuery, gql } from "@apollo/client";
import queries from "../api";

function LandingScreen() {
  const { loading, error, data } = useQuery(queries.BOARD_NAME, {
    variables: { ids: [757616149] },
  });

  if (loading) return null;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h1>{data.boards[0].name}</h1>
      {data.boards[0].subscribers.map((sub) => (
        <p>{sub.name}</p>
      ))}
    </div>
  );
}

export default LandingScreen;
