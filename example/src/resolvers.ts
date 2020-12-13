import { v4 as uuidv4 } from 'uuid';

import { authors, books } from './data';
import { Resolvers } from './generated';

export function generateAsyncResponse<T = any>(dataFn: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.985) {
        let data: T;

        try {
          data = dataFn();

          resolve(data);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error('Error in async operation'));
      }
    }, Math.floor(Math.random() * 500) + 1);
  });
}

export const resolvers: Resolvers = {
  Query: {
    author(_parent, { id }) {
      return generateAsyncResponse(() => {
        const author = authors.find((author) => author.id === id);

        if (!author) {
          throw new Error('Author not found');
        }

        return author;
      });
    },
    authors() {
      return generateAsyncResponse(() => authors);
    },
    book(_parent, { id }) {
      return generateAsyncResponse(() => {
        const book = books.find((book) => book.id === id);

        if (!book) {
          throw new Error('Book not found');
        }

        return book;
      });
    },
    books() {
      return generateAsyncResponse(() => books);
    }
  },
  Mutation: {
    addAuthor(_parent, { author }) {
      return generateAsyncResponse(() => {
        const newAuthor = {
          id: uuidv4(),
          name: author.name
        };

        authors.push(newAuthor);

        return newAuthor;
      });
    },
    deleteAuthor(_parent, { authorId }) {
      return generateAsyncResponse(() => {
        const authorIndex = authors.findIndex((author) => {
          return author.id === authorId;
        });

        if (authorIndex === -1) {
          throw new Error('Author not found');
        }

        books
          .reduceRight((acc, book, bookIndex) => {
            if (book.authorId === authorId) {
              acc.push(bookIndex);
            }

            return acc;
          }, [] as number[])
          .forEach((bookIndex) => {
            books.splice(bookIndex, 1);
          });

        authors.splice(authorIndex, 1);

        return authorId;
      });
    },
    addBook(_parent, { book }) {
      return generateAsyncResponse(() => {
        const newBook = {
          authorId: book.authorId,
          id: uuidv4(),
          title: book.title
        };

        books.push(newBook);

        return newBook;
      });
    },
    deleteBook(_parent, { bookId }) {
      return generateAsyncResponse(() => {
        const bookIndex = books.findIndex((book) => {
          return book.id === bookId;
        });

        if (bookIndex === -1) {
          throw new Error('Book not found');
        }

        books.splice(bookIndex, 1);

        return bookId;
      });
    }
  },
  Author: {
    books(author) {
      return generateAsyncResponse(() => books.filter((book) => book.authorId === author.id));
    }
  },
  Book: {
    author(book) {
      return generateAsyncResponse(() => {
        const author = authors.find((author) => author.id === book.authorId);

        if (!author) {
          throw new Error('Author not found');
        }

        return author;
      });
    }
  }
};
