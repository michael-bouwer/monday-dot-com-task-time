import React, { useState } from "react";
import { Bar } from "@reactchartjs/react-chart.js";
import { PolarArea } from "@reactchartjs/react-chart.js";
import { useQuery, useReactiveVar } from "@apollo/client";
import { _currentBoard } from "../../globals/variables";
import moment from "moment";
import "./styles.scss";

//Custom
import queries from "../../api";
import Loading from "../../components/Loading";

export function CustomBar() {
  const data = {
    labels: ["1", "2", "3"],
    datasets: [
      {
        label: "# of Red Votes",
        data: [12, 19, 3],
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        label: "# of Blue Votes",
        data: [2, 3, 20],
        backgroundColor: "rgb(54, 162, 235)",
      },
      {
        label: "# of Green Votes",
        data: [3, 10, 13],
        backgroundColor: "rgb(75, 192, 192)",
      },
    ],
  };

  const options = {
    maintainsAspectRatio: false,
    responsive: true,
    scales: {
      yAxes: [
        {
          stacked: true,
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      xAxes: [
        {
          stacked: true,
        },
      ],
    },
  };

  return <Bar data={data} options={options} />;
}

export default CustomBar;
