import { gql } from "@apollo/client";

const queries = {
  // Returns the name of the passed board ID
  BOARD_NAME: gql`
    query BoardName($ids: [Int!]) {
      boards(ids: $ids) {
        name
        subscribers {
          id
          name
        }
      }
    }
  `,

  //
  SUBSCRIBERS: gql`
    query BoardSubscribers($ids: [Int!]) {
      boards(ids: $ids) {
        subscribers {
          id
          name
        }
      }
    }
  `,
};

export default queries;
