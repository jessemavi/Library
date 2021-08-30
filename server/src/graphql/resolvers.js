const resolvers = {
  Author: {
    books(author, args, { dataSources}, info) {
      // return books for an author
      return dataSources.db.getAuthorBooks(author.id);
    },
  },

  Book: {
    authors(book, args, { dataSources }, info) {
      // return authors for a book
      return dataSources.db.getBookAuthors(book.id);
    },
    reviews(book, args, { dataSources }, info) {
      return dataSources.db.getBookReviews(book.id);
    }
  },

  Review: {
    book(review, args, { dataSources }, info) {
      return dataSources.db.getBookById(review.book_id);
    },
    reviewedOn(review, args, { dataSources }, info) {
      return review.created_at;
    }
  },

  Query: {
    author(root, { id }, { dataSources }, info) {
      return dataSources.db.getAuthorById(id);
    },
    authors(root, args, { dataSources }, info) {
      return dataSources.db.getAuthors();
    },
    book(root, { id }, { dataSources }, info) {
      return dataSources.db.getBookById(id);
    },
    books(root, args, { dataSources }, info) {
      return dataSources.db.getBooks();
    },
    review(root, { id }, { dataSources }, info) {
      return dataSources.db.getReviewById(id);
    }
  }
};

export default resolvers;
