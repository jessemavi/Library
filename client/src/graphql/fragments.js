import { gql } from "@apollo/client";

export const viewerAndToken = gql`
  fragment viewerAndToken on AuthPayload {
    viewer { 
      id
      email
      name
      username
    }
    token 
  }
`;

export const book = gql`
  fragment book on Book {
    id
    title
    cover
    authors { 
      id
      name
    }
  } 
`;

export const review = gql`
  fragment review on Review {
    id
    rating
    reviewedOn
    text
    book {
      id
    }
    reviewer {
      id
      name
    }
  }
`;