import { gql } from "@apollo/client";

const queries = {
  // Returns the name of the passed board ID
  BOARD_NAME: gql`
    query BoardName($ids: [Int!]) {
      boards(ids: $ids) {
        name
      }
    }
  `,

  // Subscribers on this board
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

  // Owner of this board
  CURRENT_USER: gql`
    query Me {
      me {
        id
        name
        photo_original
      }
    }
  `,
};

export default queries;
