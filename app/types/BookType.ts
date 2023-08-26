import { Timestamp } from 'firebase/firestore';

export type BookType = {
  docId: string;
  userId: string;
  userName: string;
  userPhotoURL: string;
  title: string;
  author: string;
  category: string;
  point: string;
  picture: string;
  createdAt: Timestamp;
  likeCount: number;
};
