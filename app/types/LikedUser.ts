import { Timestamp } from 'firebase/firestore';

export type LikedUser = {
  docId: string;
  userId: string;
  createdAt: Timestamp;
  // userName:string
};
