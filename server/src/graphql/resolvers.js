import data from '../../db.js';

const resolvers = {
  Author: {
    async books(author, args, context, info) {
      // return books for an author
    },
  },

  Book: {
    async authors(book, args, context, info) {
      // return authors for a book
    }
  },

  Query: {
    async author(root, { id }, { dataSources }, info) {
      return dataSources.db.getAuthorById(id);
    },
    async authors(root, args, { dataSources }, info) {
      return dataSources.db.getAuthors();
    },
    async book(root, { id }, { dataSources }, info) {
      return dataSources.db.getBookById(id);
    },
    async books(root, args, { dataSources }, info) {
      return dataSources.db.getBooks();
    },
  }
};

export default resolvers;
