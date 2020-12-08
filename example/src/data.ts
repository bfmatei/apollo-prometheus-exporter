import { AuthorModel, BookModel } from './types';

export const authors: AuthorModel[] = [
  {
    id: '896f5927-600f-47bd-a9f0-06ea9a3cb1f1',
    name: 'Miguel de Cervantes'
  },
  {
    id: '7aef99c4-d304-4611-bdbd-c68b5a1be0dc',
    name: 'J.R.R. Tolkien'
  },
  {
    id: 'c5c437fe-2096-4ef1-8379-74d7e0c6e4c7',
    name: 'J.K. Rowling'
  },
  {
    id: 'a5b0f35a-509d-49aa-943f-ab0801998c20',
    name: 'Agatha Christie'
  },
  {
    id: '9b180c05-8c2a-4b98-894b-7e2d56612ade',
    name: 'Lewis Carroll'
  },
  {
    id: '2005dc95-2f41-4b34-9f1f-6502db8aaf3b',
    name: 'C.S. Lewis'
  },
  {
    id: '81f09f92-f52b-4032-a7d9-08a6eaa4c42c',
    name: 'Carlo Collodi'
  },
  {
    id: 'c9cf83e9-b7a2-479c-9d48-da12ed5d4835',
    name: 'J.D. Salinger'
  },
  {
    id: '771d6fef-8230-4ae9-af22-51c597264a35',
    name: 'L. M. Montgomery'
  },
  {
    id: 'd7a5b285-ca02-48ac-be38-5576e4b77f2d',
    name: 'Jules Verne'
  }
];

export const books: BookModel[] = [
  {
    id: '1287910e-6e8a-4924-b105-cdcf7ae6ca28',
    title: 'Don Quixote',
    authorId: '896f5927-600f-47bd-a9f0-06ea9a3cb1f1'
  },
  {
    id: '9250d68b-a89b-4332-b90c-e2b843ee90c3',
    title: 'Lord of the Rings',
    authorId: '7aef99c4-d304-4611-bdbd-c68b5a1be0dc'
  },
  {
    id: 'e4e3edad-85ae-467d-bd51-c16ec447cfaa',
    title: "Harry Potter and the Sorcerer's Stone",
    authorId: 'c5c437fe-2096-4ef1-8379-74d7e0c6e4c7'
  },
  {
    id: 'b179320a-6bec-4f20-b32a-a384e033141e',
    title: 'And Then There Were None',
    authorId: 'a5b0f35a-509d-49aa-943f-ab0801998c20'
  },
  {
    id: '88fde611-f9b2-4e6a-a110-88d2cd4d9296',
    title: 'Murder on the Orient Express',
    authorId: 'a5b0f35a-509d-49aa-943f-ab0801998c20'
  },
  {
    id: 'ccc2b704-c23a-4871-9fc1-0409a08b0104',
    title: 'Death on the Nile',
    authorId: 'a5b0f35a-509d-49aa-943f-ab0801998c20'
  },
  {
    id: '454796a8-1f8f-4f69-a30f-e60c93296e4a',
    title: "Alice's Adventures in Wonderland",
    authorId: '9b180c05-8c2a-4b98-894b-7e2d56612ade'
  },
  {
    id: '49b44cf5-c49a-4717-8116-fc72162c4c62',
    title: 'The Hunting of the Snark',
    authorId: '9b180c05-8c2a-4b98-894b-7e2d56612ade'
  },
  {
    id: '78aa693b-63c4-4ab7-ada2-7d2871a31267',
    title: 'Sylvie and Bruno',
    authorId: '9b180c05-8c2a-4b98-894b-7e2d56612ade'
  },
  {
    id: '60d72448-5979-447f-82c6-e94096095ea9',
    title: 'The Lion, the Witch, and the Wardrobe',
    authorId: '2005dc95-2f41-4b34-9f1f-6502db8aaf3b'
  },
  {
    id: '9dcd5ff6-5aee-403f-abf6-c696df91144d',
    title: 'Pinocchio',
    authorId: '81f09f92-f52b-4032-a7d9-08a6eaa4c42c'
  },
  {
    id: 'e1b1afb2-5131-4d15-8913-12adde34c427',
    title: 'Catcher in the Rye',
    authorId: 'c9cf83e9-b7a2-479c-9d48-da12ed5d4835'
  },
  {
    id: '8dfdcf07-f70d-43c2-bc77-031e1d8a13ba',
    title: 'Anne of Green Gables',
    authorId: '771d6fef-8230-4ae9-af22-51c597264a35'
  },
  {
    id: '2942dfba-2990-45b5-8363-c347ff32e5a4',
    title: 'Twenty Thousand Leagues Under the Sea',
    authorId: 'd7a5b285-ca02-48ac-be38-5576e4b77f2d'
  }
];
