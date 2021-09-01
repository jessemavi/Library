import { gql } from "apollo-server";

const typeDefs = gql`
  enum Genre {
    ADVENTURE
    CHILDREN
    CLASSICS
    COMIC_GRAPHIC_NOVEL
    DETECTIVE_MYSTERY
    DYSTOPIA
    FANTASY
    HORROR
    HUMOR
    NON_FICTION
    SCIENCE_FICTION
    ROMANCE
    THRILLER
    WESTERN
  }

  input CreateBookInput {
    authorIds: [ID]
    cover: String
    genre: Genre
    summary: String
    title: String!
  }

  input CreateReviewInput {
    bookId: ID!
    rating: Int!
    reviewerId: ID!
    text: String
  }

  input UpdateReviewInput {
    id: ID!
    rating: Int!
    text: String
  }

  input UpdateLibraryBooksInput {
    bookIds: [ID!]!
    userId: ID!
  }

  input SignUpUser {
    email: String!
    name: String!
    username: String!
  }

  type Author {
    id: ID!
    books: [Book]
    name: String!
  }

  type Book {
    id: ID!
    authors: [Author]
    cover: String
    genre: Genre
    reviews: [Review]
    summary: String
    title: String!
  }

  type Review {
    id: ID!
    book: Book
    rating: Int!
    reviewedOn: String!
    reviewer: User!
    text: String
  }

  type User {
    id: ID!
    email: String!
    library: [Book]
    name: String!
    reviews: [Review]
    username: String!
  }

  type Query {
    author(id: ID!): Author
    authors: [Author]
    book(id: ID!): Book
    books: [Book]
    review(id: ID!): Review
    user(username: String!): User
  }

  type Mutation {
    createAuthor(name: String!): Author!
    createBook(input: CreateBookInput!): Book!
    createReview(input: CreateReviewInput!): Review!
    deleteReview(id: ID!): ID!
    updateReview(input: UpdateReviewInput!): Review
    signUp(input: SignUpUser!): User!
    addBooksToLibrary(input: UpdateLibraryBooksInput!): User!
    removeBooksFromLibrary(input: UpdateLibraryBooksInput!): User!
  }
`;

export default typeDefs;
