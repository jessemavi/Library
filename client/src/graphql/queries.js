import { gql } from '@apollo/client';

import { book, review } from './fragments';

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

export const GetBook = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
      ...book
      summary
      viewerHasInLibrary
      viewerHasReviewed
      reviews {
        ...review
      }
    }
  }
  ${book}
  ${review}
`;

export const GetReview = gql`
  query GetReview($id: ID!) {
    review(id: $id) {
      id
      rating
      text
    }
  }
`;