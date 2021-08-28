import data from '../../db.js';

const resolvers = {
  Author: {
    async books(author, args, context, info) {
      // return bopoks for an author
    },
  },

  Book: {
    async authors(book, args, context, info) {
      // return authors for a book
    }
  },

  Query: {
    async author(root, { id }, context, info) {
      return data.authors.find(author => author.id === Number(id));
    },
    async authors(root, args, context, info) {
      return data.authors;
    },
    async book(root, { id }, context, info) {
      return data.books.find(book => book.id === Number(id));
    },
    async books(root, args, context, info) {
      return data.books;
    },
  }
};

export default resolvers;
