import { gql } from "@apollo/client";

const queries = {
  // Returns the name of the passed board ID
  BOARD: gql`
    query BoardName($ids: [Int!]) {
      me {
        id
        name
        photo_original
      }
      boards(ids: $ids) {
        name
      }
    }
  `,

  // Subscribers on this board
  SUBSCRIBERS: gql`
    query BoardSubscribers($ids: [Int!]) {
      me{
        id
        name
        photo_original
      }
      boards(ids: $ids) {
        subscribers {
          id
          name
          photo_original
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

  // Owner of this board
  USERS_ITEMS: gql`
    query Me($ids: [Int!]) {
      me {
        id
        name
      }
      boards(ids: $ids) {
        groups{
          id
          title
          color
        }
        items {
          id
          name
          subscribers {
            id
          }
          group {
            id
            title
            color
          }
        }
      }
    }
  `,
};

export default queries;
