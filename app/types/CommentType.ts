import { Timestamp } from 'firebase/firestore';

export type CommentType = {
  docId: string;
  text: string;
  userId: string;
  userName: string;
  userPhotoURL: string;
  bookId: string;
  createdAt: Timestamp;
};
