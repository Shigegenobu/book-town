'use client';
import { Avatar, Box, Button, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BookType } from '@/app/types/BookType';
import { db } from '@/app/service/firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/app/context/auth';

export default function List() {
  const [books, setBooks] = useState<BookType[]>([]);
  const user = useAuth();
  // console.log(user);

  // if (user && user.user) {
  //   const userIcon = user.user.photoURL;
  //   console.log(userIcon);
  //   // 以降のコードで userIcon を使用する
  // } else {
  //   console.log('だめ');
  //   // ユーザーがログインしていない場合の処理
  //   // 例えば、代替のアイコンを表示する、ログインを促すなど
  // }

  useEffect(() => {
    // firebaseからデータを取得
    const bookData = collection(db, 'books');
    getDocs(bookData).then((snapShot) => {
      const fetchedBooks = snapShot.docs.map((doc) => {
        const data = doc.data();
        // console.log(data)
        return {
          id: doc.id,
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
          id: doc.id,
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

  useEffect(() => {
    console.log(books);
  }, [books]);

  return (
    <>
      <Container>
        <h1>このページに投稿された内容が入る予定</h1>
        {/* <Box>
          <Stack spacing={2}>
            <TextField label="タイトル入力欄" variant="standard" autoComplete="off" />
            <TextField label="作者を入力欄" variant="standard" autoComplete="off" />
            <TextField label="出版社入力欄" variant="standard" autoComplete="off" />
            <TextField label="ジャンル入力欄" variant="standard" autoComplete="off" />
          </Stack>
          <br />
          <br />
          <br />
          <Box>
            <MenuBookTwoToneIcon />
          </Box>
        </Box> */}
        <Box>
          <Grid container justifyContent="space-between" spacing={2} mt={2}>
            <Grid item>
              {/* <Link href="./bookshow/">
              <Button variant="contained">詳細ページへ</Button>
            </Link> */}
            </Grid>
            <Grid item>
              <Link href="./create/">
                <Button variant="contained" size="large" color="warning">
                  投稿する
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Box>

        <ul>
          <Grid container spacing={2} justifyContent="center">
            {books.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <Link href={`/${book.id}/`} style={{ textDecoration: 'none', color: 'black' }}>
                  <Box
                    border="1px solid #ccc"
                    borderRadius="5px"
                    padding="10px"
                    marginBottom="10px"
                    >
                    {book.picture && <img src={book.picture} alt="本の写真" width="100%" />}
                    <Avatar alt="" src="userIcon" />
                    <Typography>タイトル：「{book.title}」</Typography>
                    <Typography>著者 ：「{book.author}」</Typography>
                    <Typography>{book.createdAt&&book.createdAt.toDate().toLocaleString()}</Typography>
                  </Box>
                </Link>
              </Grid>
            ))}
          </Grid>
        </ul>
      </Container>
    </>
  );
}
