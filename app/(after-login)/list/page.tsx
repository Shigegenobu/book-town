'use client';
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';
import Link from 'next/link';
import { ChangeEvent, useEffect, useState } from 'react';
import { BookType } from '@/app/types/BookType';
import { db } from '@/app/service/firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';

export default function List() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [sortDateDirection, setSortDateDirection] = useState<'asc' | 'desc'>('asc');
  const [filterTitle, setFilterTitle] = useState('');
  const [filterAuthor, setFilterAuthor] = useState<string>('');
  const [filterUserId, setFilterUserId] = useState<string>('');

  const handleSortDateClick = () => {
    console.log('並び替え成功');
    setSortDateDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
  };

  const filteredBooks = books.filter((book) => {
    const matchesTitle = book.title.toLowerCase().includes(filterTitle.toLowerCase());
    const matchesAuthor = book.author.toLowerCase().includes(filterAuthor.toLowerCase());
    const matchesUserId = book.userId.toLowerCase().includes(filterUserId.toLowerCase());

    return matchesAuthor && matchesUserId && matchesTitle;
  });

  useEffect(() => {
    const sortedBooks = [...books].sort((a, b) => {
      const dateA = a.createdAt.toDate();
      const dateB = b.createdAt.toDate();

      if (sortDateDirection === 'asc') {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
    setBooks(sortedBooks);
  }, [sortDateDirection]);

  useEffect(() => {
    // firebaseからデータを取得
    const bookData = collection(db, 'books');
    getDocs(bookData).then((snapShot) => {
      const fetchedBooks = snapShot.docs.map((doc) => {
        const data = doc.data();
        // console.log(data);
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

  useEffect(() => {
    // console.log(books);
  }, [books]);

  return (
    <>
      <Container>
        <h1>このページに投稿された内容が入る予定</h1>
        <Box sx={{ display: 'flex', alignContent: 'center' }}>
          <Typography mr={3} sx={{ display: 'inline-block', width: '150px' }}>
            タイトルで絞り込む
          </Typography>
          <TextField
            autoComplete="off"
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
          />
        </Box>
        <Box sx={{ display: 'flex', alignContent: 'center', mt: 3 }}>
          <Typography mr={3} sx={{ display: 'inline-block', width: '150px' }}>
            著者で絞り込む
          </Typography>
          <TextField
            autoComplete="off"
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
          />
        </Box>
        <Box sx={{ display: 'flex', alignContent: 'center', mt: 3 }}>
          <Typography mr={3} sx={{ display: 'inline-block', width: '150px' }}>
            IDで絞り込む
          </Typography>
          <TextField
            autoComplete="off"
            value={filterUserId}
            onChange={(e) => setFilterUserId(e.target.value)}
          />
        </Box>

        <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-evenly', width: 300 }}>
          <Box>
            <Button variant="contained" onClick={() => handleSortDateClick()}>
              {sortDateDirection === 'asc' ? '最新順に' : '古い順に'}
            </Button>
          </Box>
          <Box>
            <Button variant="contained">いい本📕</Button>
          </Box>
        </Box>
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
            {filteredBooks.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.docId}>
                <Link href={`/${book.docId}/`} style={{ textDecoration: 'none', color: 'black' }}>
                  <Box
                    border="1px solid #ccc"
                    borderRadius="5px"
                    padding="10px"
                    marginBottom="10px"
                  >
                    <Box sx={{ display: 'inline-flex', alignContent: 'center' }}>
                      <Avatar alt="" src={book.userPhotoURL} />
                      <Typography fontSize={25}>{book.userName}</Typography>
                    </Box>
                    <Box sx={{ fontSize: 3 }}>ID:{book.userId}</Box>
                    <br />
                    {book.picture && <img src={book.picture} alt="本の写真" width="100%" />}
                    <Typography>タイトル：「{book.title}」</Typography>
                    <Typography>著者 ：「{book.author}」</Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 3,
                      }}
                    >
                      <MenuBookTwoToneIcon fontSize="large" />

                      <Typography>
                        {book.createdAt && book.createdAt.toDate().toLocaleString()}
                      </Typography>
                    </Box>
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
