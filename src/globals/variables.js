import { makeVar } from "@apollo/client";

export const _currentUser = makeVar();

export const _currentBoard = makeVar();

export const _currentTimesheet = makeVar([]);

export const _currentComponent = makeVar();

export const _pages = {
  TIMESHEET: "timesheet",
  COMPONENTA: "a",
  COMPONENTB: "b",
  COMPONENTC: "c",
};
