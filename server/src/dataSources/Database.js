import { SQLDataSource } from "datasource-sql";

// number of seconds to retain the data in the cache
const MINUTE = 60;

class Database extends SQLDataSource {
  getAuthorById(id) {
    return this.knex
      .select('*').from('authors').where({ id }).cache(MINUTE)
        .then(rows => rows[0])
        .catch(err => console.error(err));
  }

  getAuthors() {
    return this.knex.select('*').from('authors').cache(MINUTE);
  }

  getBookById(id) {
    return this.knex
      .select('*').from('books').where({ id }).cache(MINUTE)
        .then(rows => rows[0])
        .catch(err => console.error(err));
  }

  getBooks() {
    return this.knex.select('*').from('books').cache(MINUTE);
  }
}

export default Database;
