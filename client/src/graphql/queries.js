import { gql } from '@apollo/client';

import { book } from './fragments';

export const GetBooks = gql`
  query GetBooks {
    books {
      ...book
    }
  }
  ${book}
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

export const GetViewerLibrary = gql`
  query GetViewerLibrary {
    viewer { 
      id
      library {
        ...book
      }
    } 
  }
  ${book}
`;