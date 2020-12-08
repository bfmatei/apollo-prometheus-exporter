import { authors, books } from './data';
import { Author, Resolvers } from './generated';

export const resolvers: Resolvers = {
  Query: {
    author(_parent, { id }) {
      return authors.find((author) => author.id === id) ?? null;
    },
    authors() {
      return authors;
    },
    book(_parent, { id }) {
      return books.find((book) => book.id === id) ?? null;
    },
    books() {
      return books;
    }
  },
  Author: {
    books(author) {
      return books.filter((book) => book.authorId === author.id);
    }
  },
  Book: {
    author(book) {
      return authors.find((author) => author.id === book.authorId) as Author;
    }
  }
};
