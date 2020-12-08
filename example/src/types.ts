export interface AuthorModel {
  id: string;
  name: string;
}

export interface BookModel {
  id: string;
  title: string;
  authorId: string;
}
