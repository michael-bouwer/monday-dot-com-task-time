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

export function CustomPolar() {
  const [timesheets, setTimesheets] = useState([]);
  const { loading, error, data, refetch } = useQuery(queries.SUBSCRIBERS, {
    //fetchPolicy: "network-only",
    variables: { ids: _currentBoard() },
  });

  const datas = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <Loading text="Looking up board user details" />;
  if (error) return <span>something went wrong :(</span>;

  const getTimesheetForWeek = async (date) => {
    //     await monday.storage.instance
    //       .getItem("timesheet_" + user.id + "_" + getDateRange(moment()))
    //       .then((res) => {
    //         const { value, version } = res.data;
    //         if (value && value.length > 0) {
    //           let todaySum = 0;
    //           let weekSum = 0;
    //           const timesheet = JSON.parse(value);
    //           if (timesheet && timesheet.length > 0) {
    //             setUserTimesheet(timesheet);
    //             timesheet.map((item) => {
    //               item.timeCaptureForDaysOfWeek.map((dayTime, index) => {
    //                 if (index === 0) {
    //                   //Monday jsut for testing
    //                   todaySum += parseFloat(dayTime);
    //                 }
    //                 weekSum += parseFloat(dayTime);
    //               });
    //             });
    //           }
    //           setHoursToday(todaySum.toFixed(2));
    //           setHoursWeek(weekSum.toFixed(2));
    //         } else {
    //           // do nothing
    //           setHoursToday(0);
    //           setHoursWeek(0);
    //         }
    //       });
    //   };
  };

  return <PolarArea data={datas} />;
}
