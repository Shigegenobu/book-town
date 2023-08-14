import { Timestamp } from "firebase/firestore";

export type BookType = {
  title: string;
  author: string;
  category: string;
  point: string;
  id: string;
  picture: string;
  createdAt: Timestamp;
};
