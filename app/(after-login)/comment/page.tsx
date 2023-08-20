"use client"
import { useAuth } from '@/app/context/auth';
import { BookType } from '@/app/types/BookType';
import { Box, Button } from '@mui/material';
import { useState } from 'react';

export default function Comment() {
  // コメント一覧とコメント投稿フォームに関するステートと関数の追加
  const [books, setBooks] = useState<BookType[]>([]);
  const [newComment, setNewComment] = useState('');

  const { user } = useAuth();

  // const handlePostComment = async () => {
  //   try {
  //     if (books) {
  //       const updatedComments = [
  //         ...book.comments,
  //         {
  //           text: newComment,
  //           userId: user.userId,
  //           userName: user.userName,
  //           createdAt: Timestamp.now(),
  //         },
  //       ];
  //       await updateDoc(deleteDocRef, { comments: updatedComments });
  //       setBooks((prevBooks) =>
  //         prevBooks.map((prevBook) =>
  //           prevBook.docId === bookToShow.docId
  //             ? { ...prevBook, comments: updatedComments }
  //             : prevBook
  //         )
  //       );
  //       setNewComment('');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleDeleteComment = async (index) => {
  //   try {
  //     if (bookToShow) {
  //       const updatedComments = [...bookToShow.comments];
  //       updatedComments.splice(index, 1);
  //       await updateDoc(deleteDocRef, { comments: updatedComments });
  //       setBooks((prevBooks) =>
  //         prevBooks.map((prevBook) =>
  //           prevBook.docId === bookToShow.docId
  //             ? { ...prevBook, comments: updatedComments }
  //             : prevBook
  //         )
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <>
      {/* {bookToShow && ( */}
        <Box>
          <h2>コメント一覧</h2>
          {/* {bookToShow.comments.map((comment, index) => (
            <Box key={index}>
              <p>{comment.text}</p>
              <p>投稿者: {comment.userName}</p>
              //削除ボタンを表示し、クリック時にコメント削除の関数を呼び出す
              {comment.userId === user.userId && (
                <Button onClick={() => handleDeleteComment(index)}>削除</Button>
              )}
              <hr />
            </Box>
          ))} */}
        </Box>
      {/* )} */}
      // コメント投稿フォームの作成
      {user && (
        <Box>
          <h2>コメントを投稿する</h2>
          <input type="text" />
          {/* <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} /> */}
          <Button>投稿</Button>
          {/* <Button onClick={handlePostComment}>投稿</Button> */}
        </Box>
      )}
    </>
  );
}
