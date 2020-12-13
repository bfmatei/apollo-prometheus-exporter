export interface AuthorModel {
  id: string;
  name: string;
}

export interface AddAuthorModel {
  name: string;
}

export interface BookModel {
  authorId: string;
  id: string;
  title: string;
}

export interface AddBookModel {
  authorId: string;
  title: string;
}
