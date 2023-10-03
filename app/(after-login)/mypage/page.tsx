'use client';
import { Avatar, Box, Button, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';

import Link from 'next/link';
import { auth, db, storage } from '../../service/firebase';
import { useAuth } from '@/app/context/auth';
import { ChangeEvent, useEffect, useState } from 'react';
import { BookType } from '@/app/types/BookType';
import { collection, doc, getDocs, onSnapshot, updateDoc, writeBatch } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import LoadingIndicator from './LoadingIndicator';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export default function Mypage() {
  const { user } = useAuth();
  // console.log(user)

  const [books, setBooks] = useState<BookType[]>([]);
  const [newName, setNewName] = useState('');
  const [newPhotoURL, setNewPhotoURL] = useState('');
  const [userBooks, setUserBooks] = useState<BookType[]>([]);

  const userGetName = auth.currentUser?.displayName;
  // console.log(userGetName)
  const userDocId = auth.currentUser?.uid;
  const userGetPhotoURL = auth.currentUser?.photoURL;
  // console.log(auth.currentUser?.photoURL);

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
        console.log('データの書き込み前:', userDocId, userGetName);

        // usersコレクションのユーザー名を更新
        const userRef = doc(db, 'users', userDocId);
        await updateDoc(userRef, { name: newName });

        // Firebase 認証ユーザーの表示名を更新
        const currentUser = auth.currentUser;
        if (currentUser) {
          updateProfile(currentUser, {
            displayName: newName,
          })
            .then(() => {
              console.log('認証ユーザーの表示名更新成功');
            })
            .catch((error: any) => {
              console.log(error);
            });
        } else {
          // ユーザーがログインしていない場合のエラーハンドリング
          console.error('ユーザーがログインしていません');
        }
        // booksコレクション内のuserNameフィールドも更新
        const booksQuerySnapshot = await getDocs(collection(db, 'books'));
        const batch = writeBatch(db);

        booksQuerySnapshot.docs.map((doc) => {
          const bookData = doc.data();
          if (bookData.userId === userDocId) {
            // ログインユーザーの本のuserNameを更新
            const bookRef = doc.ref;
            batch.update(bookRef, { userName: newName });
          }
        });
        // バッチで更新をコミット
        await batch.commit();

        console.log('データの書き込み後:', userDocId, newName);
        console.log('更新されました');
      }
    } catch (error) {
      console.error('データの書き込みエラー:', error);
    }
  };

  const OnFileUploadToFirebase = (e: { target: { files: any } }) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, file.name);

    const uploadImage = uploadBytesResumable(storageRef, file);

    uploadImage.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {
          console.log('アップロード成功！');
          console.log('File available at', downloadURL);

          setNewPhotoURL(downloadURL);
        });
      }
    );
  };

  const handleAvatarClick = async () => {
    try {
      if (!newPhotoURL) {
        alert('画像が未出力です');
        return;
      }
      if (userDocId) {
        console.log('データの書き込み前:', userDocId, userGetPhotoURL);

        // usersコレクションのユーザー名を更新
        const userRef = doc(db, 'users', userDocId);
        await updateDoc(userRef, { photoURL: newPhotoURL });

        // Firebase 認証ユーザーの表示名を更新
        const currentUser = auth.currentUser;
        if (currentUser) {
          updateProfile(currentUser, {
            photoURL: newPhotoURL,
          })
            .then(() => {
              console.log('認証ユーザーの表示名更新成功');
            })
            .catch((error: any) => {
              console.log(error);
            });
        } else {
          // ユーザーがログインしていない場合のエラーハンドリング
          console.error('ユーザーがログインしていません');
        }
        // booksコレクション内のuserPhotoURLフィールドも更新
        const booksQuerySnapshot = await getDocs(collection(db, 'books'));
        const batch = writeBatch(db);

        booksQuerySnapshot.docs.map((doc) => {
          const bookData = doc.data();
          if (bookData.userId === userDocId) {
            // ログインユーザーの本のphotoURLを更新
            const bookRef = doc.ref;
            batch.update(bookRef, { userPhotoURL: newPhotoURL });
          }
        });
        // バッチで更新をコミット
        await batch.commit();

        //リロード
        await window.location.reload();

        console.log('データの書き込み後:', userDocId, newPhotoURL);
        console.log('更新されました');
      }
    } catch (error) {
      console.error('データの書き込みエラー:', error);
    }
  };

  useEffect(() => {
    //firebaseからデータを取得
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
      setBooks(updatedBooks);
      // console.log(updatedBooks);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // ユーザーが投稿した本を取得
    const userBookData = books.filter((book) => book.userId === userDocId);

    // 各本に対していいねの数を取得
    Promise.all(
      userBookData.map(async (book) => {
        const likedUserRef = collection(db, 'books', book.docId, 'LikedUsers');
        const querySnapshot = await getDocs(likedUserRef);
        // console.log('サブコレクション数', querySnapshot.size);
        book.likeCount = querySnapshot.size;
        return book;
      })
    )
      .then((updatedUserBooks) => {
        // すべての非同期処理が完了した後に更新されたユーザーの本のリストをセットする
        setUserBooks(updatedUserBooks);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [books]);

  useEffect(() => {
    setNewName(userGetName || '');
  }, []);

  useEffect(() => {
    setNewName(user?.name || '');
    setNewPhotoURL(user?.photoURL || '');
  }, [user]);

  if (user === undefined) {
    return <LoadingIndicator />;
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

            <Box>
              <Typography sx={{ mb: 3, fontWeight: 'bold', color: 'orange' }}>
                アバター画像を変更する
                <Button variant="contained" size="large" onClick={handleAvatarClick} sx={{ ml: 3 }}>
                  更新
                </Button>
              </Typography>
              <Button variant="contained">
                <input type="file" accept=".png, .jpeg, .jpg" onChange={OnFileUploadToFirebase} />
              </Button>
            </Box>
          </Grid>

          <Grid item sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Avatar alt="" src={newPhotoURL} sx={{ width: 300, height: 300 }} />
          </Grid>
        </Grid>
        <Stack spacing={3} sx={{ my: 3 }}>
          <Grid>
            <Link href="./list">
              <Button variant="contained" sx={{ marginRight: 5 }}>
                一覧へ
              </Button>
            </Link>

            <Link href="./create">
              <Button variant="contained" color="info">
                投稿する
              </Button>
            </Link>
          </Grid>
        </Stack>
        <Box>
          <Typography variant="h5" sx={{ my: 5 }}>
            📖投稿済📖
          </Typography>

          <Grid container spacing={2} justifyContent="flex-start" sx={{ mt: 8 }}>
            {userBooks.length === 0 ? (
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
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
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: 'small',
                            }}
                          >
                            <MenuBookTwoToneIcon fontSize="large" />
                            <Typography ml={1}>{book.likeCount}</Typography>
                          </Box>
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
