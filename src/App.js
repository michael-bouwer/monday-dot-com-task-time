import React from "react";
import "./App.css";
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import mondaySdk from "monday-sdk-js";
import { _currentBoard, _currentTimesheet } from "./globals/variables";

import LandingScreen from "./pages/LandingScreen";
import Timesheet from "./pages/Timesheet";

const monday = mondaySdk();
_currentBoard([0]);
_currentTimesheet([]);

const httpLink = createHttpLink({
  uri: "https://api.monday.com/v2/",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token =
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

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {},
      name: "",
      triggerEvent: null,
    };
  }

  componentDidMount() {
    // TODO: set up event listeners
    monday.get("context").then((res) => {
      //set global boardId
      _currentBoard(res.data.boardIds[0]);
    });

    /*monday.storage.instance.getItem("campaigns").then((res) => {
      const { value, version } = res.data;
      console.log(value);
      //sleep(10000); // someone may overwrite serialKey during this time

      monday.storage.instance
        .setItem("test", { previous_version: version })
        .then((res) => {
          console.log(res);
        });
    });*/

    var callback = (res) => {
      /*this.setState({
        triggerEvent: res.data,
      });*/
    };
    monday.listen("events", callback);
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <Timesheet />
          {/* <LandingScreen key={this.state.triggerEvent} /> */}
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
