'use client';
import { Box, Button, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';
import { useEffect, useState } from 'react';
import { BookType } from '@/app/types/BookType';
import { db } from '@/app/service/firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/app/context/auth';

export default function List() {
  const [books, setBooks] = useState<BookType[]>([]);
  // const uesr = useAuth();

  useEffect(() => {
    // firebaseからデータを取得
    const bookData = collection(db, 'books');
    getDocs(bookData).then((snapShot) => {
      const fetchedBooks = snapShot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          author: data.author,
          category: data.category,
          point: data.point,
          picture: data.picture,
        };
      });
      console.log(fetchedBooks);
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
        <Box>
          <Box>この部分に投稿された内容が入る予定</Box>
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
        </Box>
      </Container>
      <Box>
        <Grid container justifyContent="space-between" spacing={2} mt={2}>
          <Grid item>
            <Link href="./bookshow/">
              <Button variant="contained">詳細ページへ</Button>
            </Link>
          </Grid>
          <Grid item>
            <Link href="./create/">
              <Button variant="contained">投稿する</Button>
            </Link>
          </Grid>
        </Grid>
      </Box>

      <ul>
        <Grid container spacing={2} justifyContent="center">
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Box border="1px solid #ccc" borderRadius="5px" padding="10px" marginBottom="10px">
                {/* <TextField value={book.picture} /> */}
                {book.picture && (
                  <img src={book.picture} alt="本の写真" width="100%" height="50%" />
                )}
                <Typography variant="h5">{book.title}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </ul>
      {/* <ul>
        <Grid container spacing={2} justifyContent="center">
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Box
                border="1px solid #ccc"
                borderRadius="5px"
                padding="10px"
                marginBottom="10px"
              >
                <Box>タイトル</Box>
                <TextField
                  // label="タイトルを入力して下さい"
                  // variant="standard"
                  autoComplete="off"
                  value={book.title}
                  // onChange={() => handleTitleEditChange()}
                />
                <Box>著者</Box>
                <TextField value={book.author} />
                <Box>ジャンル</Box>
                <TextField value={book.category} />
                <Box>おすすめポイント</Box>
                <TextField value={book.point} />
                <Box>本の写真</Box>
                <TextField value={book.picture} />
                {book.picture && <img src={book.picture} alt="本の写真" width="100%" />}
              </Box>
            </Grid>
          ))}
        </Grid>
      </ul> */}
    </>
  );
}
