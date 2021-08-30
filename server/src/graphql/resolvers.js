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
  }
};

export default resolvers;
