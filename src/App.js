import React, { useEffect } from "react";
import "./App.css";
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  useReactiveVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import mondaySdk from "monday-sdk-js";
import {
  _currentBoard,
  _currentTimesheet,
  _currentComponent,
  _currentUser,
  _pages,
} from "./globals/variables";

import Timesheet from "./pages/Timesheet";
import Users from "./pages/Users";
import Analytics from "./pages/Analytics";
import Header from "./components/Header";

const monday = mondaySdk();

monday.api(`query { me { id name } }`).then((res) => {
  console.log(res.data.me);
  _currentUser(res.data.me);
});
_currentBoard([0]);
_currentTimesheet([]);

const httpLink = createHttpLink({
  uri: "https://api.monday.com/v2/",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = //sessionToken;
    "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjU4NzkyNDMyLCJ1aWQiOjE0OTcwODg2LCJpYWQiOiIyMDIwLTA3LTExVDE3OjUxOjA2LjAwMFoiLCJwZXIiOiJtZTp3cml0ZSJ9.uC-owvux2QA0OdtWec5QcxxMNMFNtDWPDtHsyRkz3DQ";
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

_currentComponent(_pages.TIMESHEET);

function App() {
  const selection = useReactiveVar(_currentComponent);

  useEffect(() => {
    // TODO: set up event listeners
    monday.get("context").then((res) => {
      //set global boardId
      _currentBoard(res.data.boardIds[0]);
    });
  }, []);

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Header />
        {renderSelectedComponent()}
        {/* <LandingScreen key={this.state.triggerEvent} /> */}
      </div>
    </ApolloProvider>
  );

  function renderSelectedComponent() {
    if (selection === _pages.TIMESHEET) {
      return <Timesheet />;
    } else if (selection === _pages.USERS) {
      return <Users />;
    } else if (selection === _pages.ANALYTICS) {
      return <Analytics />;
    } else if (selection === _pages.TEAM) {
      return <Users key={1} />;
    }
  }
}

export default App;
