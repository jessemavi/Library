import { SQLDataSource } from "datasource-sql";

// number of seconds to retain the data in the cache
const MINUTE = 60;

class Database extends SQLDataSource {
  async getAuthorById(id) {
    return this.knex
      .select('*').from('authors').where({ id }).cache(MINUTE)
        .then(rows => rows[0])
        .catch(err => console.error(err));
  }

  async getAuthorBooks(authorId) {
    const books = await this.knex
      .select('*').from('authors_books')
      .join('books', 'authors_books.book_id', '=', 'books.id')
      .where({ author_id: authorId }).cache(MINUTE)
      .then(rows => rows)
      .catch(err => console.error(err));

    return books;
  }

  getAuthors() {
    return this.knex.select('*').from('authors').cache(MINUTE);
  }

  async getBookById(id) {
    return this.knex
      .select('*').from('books').where({ id }).cache(MINUTE)
        .then(rows => rows[0])
        .catch(err => console.error(err));
  }

  async getBookAuthors(bookId) {
    const authors = await this.knex
      .select('*').from('authors_books')
      .join('authors', 'authors_books.author_id', '=', 'authors.id')
      .where({ book_id: bookId }).cache(MINUTE)
      .then(rows => rows)
      .catch(err => console.error(err));

      return authors;
  }

  getBooks() {
    return this.knex.select('*').from('books').cache(MINUTE);
  }

  getBookReviews(bookId) {
    return this.knex
      .select('*').from('reviews')
      .where({ book_id: bookId }).cache(MINUTE);
  }

  async getReviewById(id) {
    return this.knex.select('*').from('reviews').where({ id }).cache(MINUTE)
      .then(rows => rows[0])
      .catch(err => console.error(err));
  }

  async getUser(username) {
    return this.knex.select('*').from('users').where({ username }).cache(MINUTE)
      .then(rows => rows[0])
      .catch(err => console.error(err));
  } 

  async getUserById(id) {
    return this.knex.select('*').from('users').where({ id }).cache(MINUTE)
      .then(rows => rows[0])
      .catch(err => console.error(err));
  }

  async getUserLibrary(userId) {
    return this.knex
      .select('*').from('users_books')
      .join('books', 'users_books.book_id', '=', 'books.id')
      .where({ user_id: userId }).cache(MINUTE)
      .then(rows => rows)
      .catch(err => console.error(err));
  }

  getUserReviews(userId) {
    return this.knex.select('*').from('reviews').where({ user_id: userId }).cache(MINUTE);
  }
} 

export default Database;
