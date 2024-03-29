import { makeVar } from "@apollo/client";

export const _currentUser = makeVar();

export const _currentBoard = makeVar();

export const _currentTimesheet = makeVar([]);

export const _currentComponent = makeVar();

export const _pages = {
  TIMESHEET: "timesheet",
  ABSENCE: "absence",
  USERS: "users",
  TEAM: "team",
  ANALYTICS: "analytics",
};

export const _loadingMessages = [
  "Synchronizing some things with other things.",
  "Adding coal to the fire.",
  "Refuelling the coffee stations.",
  "Judging the items on your board.",
  "Trying to read your hand writing",
  "Shaking hands with the database.",
  "Re-arranging the furniture.",
  "Working on it, hang tight!",
  "Shaping your data, beautifully.",
  "Neatly sorting the files.",
  "Dusting off the tables and charts.",
  "Assembling the new filing cabinet",
  "If you can read this whole message then our app is taking too long to load... awkward."
];
