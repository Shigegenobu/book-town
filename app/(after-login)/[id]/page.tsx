'use client';
import { Avatar, Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { BookType } from '@/app/types/BookType';
import { db } from '@/app/service/firebase';
import { collection, deleteDoc, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth';

export default function BookShow() {
  const [books, setBooks] = useState<BookType[]>([]);


  const { user } = useAuth();
  // console.log(user);

  const router = useRouter();
  // console.log(router)
  const params = useParams();
  // console.log(params);
  const bookId = params.id;
  // console.log(bookId);

  const bookToShow = books.find((book) => book.docId === bookId);
  console.log(bookToShow);

  // const bookUserId = bookToShow?.userId;
  // console.log(bookUserId);

  useEffect(() => {
    // firebaseからデータを取得
    const bookData = collection(db, 'books');
    getDocs(bookData).then((snapShot) => {
      const fetchedBooks = snapShot.docs.map((doc) => {
        const data = doc.data();
        return {
          docId: doc.id,
          userId: data.userId,
          userName: data.userName,
          userPhotoURL: data.userPhotoURL,
          title: data.title,
          author: data.author,
          category: data.category,
          point: data.point,
          picture: data.picture,
          createdAt: data.createdAt,
        };
      });
      // console.log(fetchedBooks);
      setBooks(fetchedBooks);
    });
    // リアルタイムで取得
    const unsubscribe = onSnapshot(bookData, (book) => {
      const updatedBooks = book.docs.map((doc) => {
        const data = doc.data();
        return {
          docId: doc.id,
          userId: data.userId,
          userName: data.userName,
          userPhotoURL: data.userPhotoURL,
          title: data.title,
          author: data.author,
          category: data.category,
          point: data.point,
          picture: data.picture,
          createdAt: data.createdAt,
        };
      });
      setBooks(updatedBooks);
    });

    return () => unsubscribe();
  }, []);

  //削除
  const handleDeleteClick = async () => {
    try {
      await deleteDoc(doc(db, 'books', bookId));
      console.log('削除されました');

      // 削除後のリダイレクト処理を追加
      router.push('/list');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // console.log(books);
  }, [books]);

  //idが同じなら編集、削除できる
  const canEdit = user && bookToShow && user.userId === bookToShow.userId;


  return (
    <>
      <Box>
        <Box>詳細ページ</Box>
        <Container>
          <Box border="1px solid #ccc" borderRadius="5px" padding="10px" marginBottom="10px">
            <Box sx={{ display: 'inline-flex', alignContent: 'center' }}>
              <Avatar alt="" src={bookToShow?.userPhotoURL} />
              <Typography fontSize={25}>{bookToShow?.userName}</Typography>
            </Box>
            <Box>ID:{bookToShow?.userId}</Box>
            <br />
            <Stack spacing={2}>
              <img src={bookToShow?.picture} alt="本の写真" width="100%" height="50%" />
              <Typography>タイトル：「{bookToShow?.title}」</Typography>
              <Typography>著者：「{bookToShow?.author}」</Typography>
              <Typography>ジャンル：「{bookToShow?.category}」</Typography>
              <Typography>⭐️おすすめポイント⭐️：「{bookToShow?.point}」</Typography>
              <Typography>
                {bookToShow?.createdAt && bookToShow.createdAt.toDate().toLocaleString()}
              </Typography>
            </Stack>
          </Box>

          <Grid container justifyContent="space-between" spacing={2} mt={2}>
            <Grid item xs={3}>
              <Link href="./list">
                <Button variant="contained">一覧へ</Button>
              </Link>
            </Grid>
            {/* <Grid item xs={3}>
              <Link href="./list">
                <Button variant="contained">楽天サイトページへ</Button>
              </Link>
            </Grid> */}
            <Grid item xs={2}>
            {/* {canEdit && ( // ログインユーザーが編集可能な場合のみ表示
            <>
              <Link href={`/bookedit?id=${bookId}`}>
                <Button variant="contained">編集ページへ</Button>
              </Link>
              <Button
                variant="contained"
                size="large"
                color="error"
                sx={{ my: 3 }}
                onClick={() => handleDeleteClick()}
              >
                削除
              </Button>
            </>
          )} */}
                {/* <Link href={`/bookedit?id=${bookUserId}`}> */}
              <Link href={`/bookedit?id=${bookId}`}>
                <Button variant="contained">編集ページへ</Button>
              </Link>
              <Button
                variant="contained"
                size="large"
                color="error"
                sx={{ my: 3 }}
                onClick={() => handleDeleteClick()}
              >
                削除
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
