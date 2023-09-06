'use client';
import { Avatar, Box, Button, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../service/firebase';
import { useAuth } from '@/app/context/auth';
import { ChangeEvent, useEffect, useState } from 'react';
import { BookType } from '@/app/types/BookType';
import { collection, doc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';
import CircularColor from '@/app/CircularColor';

export default function Mypage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  console.log(user);

  const [books, setBooks] = useState<BookType[]>([]);
  const [newName, setNewName] = useState('');

  const [userBooks, setUserBooks] = useState<BookType[]>([]);

  const userGetName = auth.currentUser?.displayName;
  console.log(userGetName);
  const userDocId = auth.currentUser?.uid;
  console.log('aa', userDocId);

  useEffect(() => {
    // ログインユーザーの投稿だけを取得
    const userBookData = books.filter((book) => book.userId === userDocId);
    setUserBooks(userBookData);
  }, [books, user]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewName(e.target.value);
  };

  const handleEditClick = async () => {
    try {
      if (!newName) {
        alert('ユーザー名が未入力です');
        return;
      }
      if (userDocId) {
        const userNameRef = doc(db, 'users', userDocId);
        await updateDoc(userNameRef, { name: newName });
        console.log('更新ok');
      }
    } catch (error) {
      console.log(error);
    }
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
          likeCount: data.likeCount,
        };
      });
      setBooks(fetchedBooks);
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
          likeCount: data.likeCount,
        };
      });
      // setBooks(updatedBooks);
      console.log(updatedBooks);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {}, [books]);

  useEffect(() => {
    setNewName(userGetName || '');
  }, []);

  useEffect(() => {
    setNewName(user?.name || '');
  }, [user]);

  if (user === undefined) {
    return (
      <>
        <Container
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <Box>ローディング中...</Box>
          <CircularColor />
        </Container>
      </>
    );
  }

  return (
    <>
      <Container sx={{ mt: 3 }}>
        <Grid container justifyContent="space-between" spacing={2} mt={2}>
          <Grid item>
            <Box>
              <Typography sx={{ fontWeight: 'bold', color: 'orange' }}>名前</Typography>
              <Box display="flex">
                <TextField
                  autoComplete="off"
                  value={newName}
                  onChange={(e) => handleNameChange(e)}
                />
                <Button variant="contained" onClick={handleEditClick} sx={{ ml: 3 }}>
                  更新
                </Button>
              </Box>
            </Box>

            <Box sx={{ my: 3 }}>
              <Typography sx={{ fontWeight: 'bold', color: 'orange' }}>email</Typography>
              <Typography>{user?.email}</Typography>
            </Box>
            <Box sx={{ my: 3 }}></Box>

            <Stack spacing={3}>
              <Grid>
                <Link href="./list">
                  <Button variant="contained" sx={{ marginRight: 5 }}>
                    一覧へ
                  </Button>
                </Link>

                <Link href="./create">
                  <Button variant="contained" color="warning">
                    投稿する
                  </Button>
                </Link>
              </Grid>
            </Stack>
          </Grid>

          <Grid item>
            <Avatar alt="" src={user?.photoURL} sx={{ width: 300, height: 300 }} />
          </Grid>
        </Grid>

        <Box>
          <Typography variant="h5" sx={{ my: 5 }}>
            📖投稿済📖
          </Typography>

          <Grid container spacing={2} justifyContent="flex-start" sx={{ mt: 8 }}>
            {userBooks.length === 0 ? (
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                {/* <Typography
                  variant="h4"
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // minHeight: '100vh',
                  }}
                >
                  投稿はありません
                </Typography> */}
                <Box
                  border="1px solid #ccc"
                  borderRadius="5px"
                  padding="10px"
                  marginBottom="10px"
                  sx={{
                    width: '100%',
                    minHeight: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  <Typography variant="h4">投稿がありません</Typography>
                </Box>
              </Grid>
            ) : (
              userBooks
                .filter((book) => book.userId === user?.id)
                .map((book) => (
                  <Grid item xs={12} sm={6} md={4} key={book.docId}>
                    <Link
                      href={`/${book.docId}/`}
                      style={{ textDecoration: 'none', color: 'black' }}
                    >
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
                        <Box
                          sx={{
                            position: 'relative',
                            paddingTop: '100%',
                            overflow: 'hidden',
                            mb: 3,
                          }}
                        >
                          {book.picture && (
                            <img
                              src={book.picture}
                              alt="本の写真"
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                              }}
                            />
                          )}
                        </Box>
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
                ))
            )}
          </Grid>
        </Box>
      </Container>
    </>
  );
}
