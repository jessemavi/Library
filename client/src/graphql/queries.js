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