import { gql } from '@apollo/client';

export const GetBooks = gql`
  query GetBooks {
    books {
      id
      title
      cover
      authors { 
        id
        name 
      }
    }
  }
`;

export const GetViewer = gql`
  query GetViewer {
    viewer {
      id
      email
      name
      username
    }
  }
`;