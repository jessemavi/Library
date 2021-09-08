import { AuthenticationError, ForbiddenError, UserInputError } from "apollo-server-errors";
import { SQLDataSource } from "datasource-sql";
import jwt from "jsonwebtoken";
import validator from "validator";

import { hashPassword, verifyPassword } from "../utils/passwords.js";

// number of seconds to retain the data in the cache
const MINUTE = 60;

class Database extends SQLDataSource {
  // utility to check for existing user names
  async checkUniqueUserData(email, username) {
    const res = await Promise.all([
      this.knex.select('email').from('users').where({ email }),
      this.knex.select('username').from('users').where({ username })
    ]);

    const [existingEmail, existingUsername] = res;

    if (existingEmail.length) {
      throw new UserInputError('Email is already in use');
    } else if (existingUsername.length) {
      throw new UserInputError('Username is already in use');
    }
  }

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

  async createAuthor(name) {
    return this.knex
      .insert({ name }, ['*']).into('authors')
      .then(rows => rows[0])
      .catch(err => console.error(err));
  }

  async createBook({ authorIds, cover, genre, summary, title }) {
    // create book
    const book = await this.knex
      .insert({ 
        ...(cover && { cover }),
        ...(genre && { genre }),
        ...(summary && { summary }),
        title
      }, ['*'])
      .into('books')
      .then(rows => rows[0])
      .catch(err => console.error(err));

    // add authorIds and bookIds to authors_books join table
    if(authorIds?.length) {
      const bookAuthors = authorIds.map(id => {
        return { author_id: id, book_id: book.id };
      });
      await this.knex
        .insert(bookAuthors).into('authors_books')
        .catch(err => console.error(err));
    }

    return book;
  }

  async createReview({ bookId, rating, reviewerId, text }) {
    const existingReview = await this.knex
      .select('*').from('reviews')
      .where({ book_id: bookId, user_id: reviewerId })
      .then(rows => rows[0]);
    
    if(existingReview) {
      throw new ForbiddenError('Users can only submit one review per book')
    }

    const review = {
      book_id: bookId,
      rating,
      user_id: reviewerId,
      ...(text && { text })
    };

    return this.knex
      .insert(review, ['*']).into('reviews')
      .then(rows => rows[0])
      .catch(err => console.error(err));
  }

  async deleteReview(id) {
    await this.knex.delete().from('reviews').where({ id });
    return id;
  }

  async updateReview({ id, rating, text }) {
    return this.knex
    .update({ rating, ...(text && { text })}, ['*'])
    .from('reviews').where({ id })
    .then(rows => rows[0])
    .catch(err => console.error(err));
  }

  async signUp({ email, name, password, username }) {
    await this.checkUniqueUserData(email, username);

    if (!validator.isStrongPassword(password)) {
      throw new UserInputError('Password must be a minimum of 8 characters in length and contain 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.');
    }

    const hashedPassword = await hashPassword(password);

    const user = await this.knex
      .insert({ email, name, password: hashedPassword, username }, ['*'])
      .into('users')
      .then(rows => rows[0])
      .catch(err => console.error(err));
    
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      subject: user.id.toString(),
      expiresIn: '1d'
    });

    return { token, viewer: user };
  }

  async login({ password, username }) {
    // refactor
    const user = await this.knex
      .select('*').from('users')
      .where({ username })
      .then(rows => rows[0])
      .catch(err => console.error(err));

    if (!user) {
      throw new AuthenticationError('User with that username does not exist');
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new AuthenticationError('Username or password is incorrect');
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      subject: user.id.toString(),
      expiresIn: '1d'
    });

    return { token, viewer: user };
  }

  async addBooksToLibrary({ bookIds, userId }) {
    // check if books already exist in a users' library
    const existingLibraryBooks = await this.knex
      .select('*').from('users_books')
      .orWhereIn('book_id', bookIds)
      .andWhere({ user_id: userId });

    // get new book ids to add
    const newBookIds = bookIds.filter(bookId => (
      !existingLibraryBooks.find(book => book.book_id === parseInt(bookId))
    ));

    const newBooksToAdd = newBookIds.map(bookId => (
      { book_id: bookId, user_id: userId }
    ));

    await this.knex
      .insert(newBooksToAdd).into('users_books')
      .catch(err => console.error(err));
    
    // refactor
    return this.knex
      .select('*').from('users').where({ id: userId })
      .then(rows => rows[0])
      .catch(err => console.error(err));
  }

  async removeBooksFromLibrary({ bookIds, userId }) {
    // get list of books to be deleted that exist in library
    const existingLibraryBooks = await this.knex
      .select('*').from('users_books')
      .orWhereIn('book_id', bookIds)
      .where({ user_id: userId })
      .catch(err => console.error(err));
    
    const existingLibraryBookIds = existingLibraryBooks.map(book => book.book_id);

    await this.knex
      .delete().from('users_books')
      .orWhereIn('book_id', existingLibraryBookIds)
      .where({ user_id: userId })
      .catch(err => console.error(err));

    // refactor
    return this.knex
      .select('*').from('users').where({ id: userId })
      .then(rows => rows[0])
      .catch(err => console.error(err));
  }

  async viewerHasInLibrary(id, bookId) {
    const response = await this.knex
      .select('*').from('users_books')
      .where({ user_id: id, book_id: bookId })
      .then(rows => rows[0])
      .catch(err => console.error(err));

      return !!response;
  }
} 

export default Database;
