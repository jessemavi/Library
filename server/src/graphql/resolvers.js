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
    },
    reviewer(review, args, { dataSources }, info) {
      return dataSources.db.getUserById(review.user_id);
    }
  },

  User: {
    library(user, args, { dataSources }, info) {
      return dataSources.db.getUserLibrary(user.id);
    },
    reviews(user, args, { dataSources }, info) {
      return dataSources.db.getUserReviews(user.id);
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
    },
    user(root, { username }, { dataSources }, info) {
      return dataSources.db.getUser(username);l
    }
  },

  Mutation: {
    createAuthor(root, { name }, { dataSources }, info) {
      return dataSources.db.createAuthor(name);
    },
    createBook(root, { input }, { dataSources }, info) {
      return dataSources.db.createBook(input);
    },
    createReview(root, { input }, { dataSources }, info) {
      return dataSources.db.createReview(input);
    },
    deleteReview(root, { id }, { dataSources }, info) {
      return dataSources.db.deleteReview(id);
    },
    updateReview(root, { input }, { dataSources }, info) {
      return dataSources.db.updateReview(input);
    },
    signUp(root, { input }, { dataSources }, info) {
      return dataSources.db.signUp(input);
    }
  }
};

export default resolvers;
