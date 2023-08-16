'use client';
import { Avatar, Box, Button, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../service/firebase';
import { useAuth } from '@/app/context/auth';
import { useEffect, useState } from 'react';
import { BookType } from '@/app/types/BookType';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';

export default function Mypage() {
  const [books, setBooks] = useState<BookType[]>([]);

  const router = useRouter();
  const { user, setUser } = useAuth();
  console.log(user);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('sign-out successful.');
        router.push('/signin');
        setUser(undefined);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    //firebaseからデータを取得
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
      setBooks(fetchedBooks);
      // console.log(fetchedBooks);
    });

    //リアルタイムで取得
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
      // console.log(updatedBooks);
      setBooks(updatedBooks);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // console.log(books);
  }, [books]);

  return (
    <>
      <Box>Mypage</Box>

      <Container>
        <Box>ログイン中の人しか見れないページ</Box>
        <Avatar alt="" src={user?.photoURL} />
        <Box>
          <Typography sx={{ fontWeight: 'bold', color: 'orange' }}>名前</Typography>
          <Typography>{user?.name}</Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontWeight: 'bold', color: 'orange' }}>ID</Typography>
          <Typography>{user?.id}</Typography>
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography sx={{ fontWeight: 'bold', color: 'orange' }}>email</Typography>
          <Typography>{user?.email}</Typography>
        </Box>
        <Box sx={{ my: 3 }}>
          {/* <Typography sx={{ fontWeight: 'bold', color: 'orange' }}>photoURL</Typography>
          <Typography>{user?.photoURL}</Typography>
          <Box sx={{ border: 1, width: '50%' }}>
            {<img src={user?.photoURL} alt="ユーザーの写真" width="50%" />}
          </Box> */}
        </Box>

        <Stack spacing={3}>
          <Grid>
            <Link href="./list">
              <Button variant="contained" sx={{ marginRight: 5 }}>
                一覧へ
              </Button>
            </Link>

            <Link href="./create">
              <Button variant="contained">投稿する</Button>
            </Link>
          </Grid>

          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{ width: 200, padding: 1, margin: 2 }}
          >
            ログアウト
          </Button>
        </Stack>

        <Box>
          <Box>自分の投稿した内容</Box>
          <Grid container spacing={2} justifyContent="center">
            {books
              .filter((book) => book.userId === user?.id)
              .map((book) => (
                <Grid item xs={12} sm={6} md={4} key={book.docId}>
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
                      {/* <MenuBookTwoToneIcon fontSize="large" /> */}

                      <Typography>
                        {book.createdAt && book.createdAt.toDate().toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
}
