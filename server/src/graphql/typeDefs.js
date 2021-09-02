import { gql } from "apollo-server";

const typeDefs = gql`
  # Genres for a book
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

  # Author who has written book(s)
  type Author {
    # unique ID
    id: ID!
    # books that were authored by this author
    books: [Book]
    # full name
    name: String!
  }

  # book which can be written by 1 or more authors and reviewed by users
  type Book {
    # unique ID of the book
    id: ID!
    # author(s) who wrote the book
    authors: [Author]
    # URL of the book's cover image
    cover: String
    # genre which the book can be assigned to
    genre: Genre
    # user submitted reviews
    reviews: [Review]
    # description of the book
    summary: String
    # title of the book
    title: String!
  }

  # review submitted by a user that includes a rating and possibly text
  type Review {
    # unique ID of the review
    id: ID!
    # the book the review is about
    book: Book
    # user's number rating of the book(1 to 5)
    rating: Int!
    # date and time review was created
    reviewedOn: String!
    # user who submitted the review
    reviewer: User!
    # text content of the review
    text: String
  }

  # user account info
  type User {
    # uniqie ID fo the user
    id: ID!
    # user's unique email address
    email: String!
    # list of books the user has added to their library
    library: [Book]
    # full name of the user
    name: String!
    # list of book reviews created by the user
    reviews: [Review]
    # user's unique username
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
    updateReview(input: UpdateReviewInput!): Review!
    signUp(input: SignUpUser!): User!
    addBooksToLibrary(input: UpdateLibraryBooksInput!): User!
    removeBooksFromLibrary(input: UpdateLibraryBooksInput!): User!
  }
`;

export default typeDefs;
