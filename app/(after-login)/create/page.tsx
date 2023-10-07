'use client';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '@/app/service/firebase';
import { BookType } from '@/app/types/BookType';
import { Timestamp, collection, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/app/context/auth';
import { useRouter } from 'next/navigation';

export default function Create() {
  const [book, setBook] = useState<BookType>({
    docId: '',
    userId: '',
    userName: '',
    userPhotoURL: '',
    title: '',
    author: '',
    category: '',
    point: '',
    picture: '',
    createdAt: Timestamp.now(),
    likeCount: 0,
  });

  const router = useRouter();
  const { user } = useAuth();
  // console.log('ユーザー', user);

  const OnFileUploadToFirebase = (e: { target: { files: any } }) => {
    // console.log(e.target.files[0].name);
    const file = e.target.files[0];
    const storageRef = ref(storage, file.name);

    const uploadImage = uploadBytesResumable(storageRef, file);

    uploadImage.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        // setLoading(true);
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
          console.log('File available at', downloadURL);

          setBook((prevBook) => ({
            ...prevBook,
            picture: downloadURL,
          }));
        });
      }
    );
  };

  const resetInput = () => {
    setBook({
      docId: '',
      userId: '',
      userName: '',
      userPhotoURL: '',
      title: '',
      author: '',
      category: '',
      point: '',
      picture: '',
      createdAt: Timestamp.now(),
      likeCount: 0,
    });
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBook((prevBook) => ({
      ...prevBook,
      title: e.target.value,
    }));
  };

  const handleAuthorChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBook((prevBook) => ({
      ...prevBook,
      author: e.target.value,
    }));
  };

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    setBook((prevBook) => ({
      ...prevBook,
      category: e.target.value,
    }));
  };

  const handlePointChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBook((prevBook) => ({
      ...prevBook,
      point: e.target.value,
    }));
  };

  const handleResetClick = () => {
    resetInput();
  };

  const handleClick = async () => {
    if (!book.title || !book.author || !book.category) {
      alert('タイトル or 著者 or ジャンル が空です');
      return;
    }

    const newBookRef = doc(collection(db, 'books'));
    //新しい投稿を作成
    const newBook: BookType = {
      userId: user.id,
      userName: user.name,
      userPhotoURL: user.photoURL,
      docId: book.docId,
      title: book.title,
      author: book.author,
      category: book.category,
      point: book.point,
      picture: book.picture,
      createdAt: Timestamp.now(),
      likeCount: book.likeCount,
    };

    await setDoc(newBookRef, newBook)
      .then(() => {
        alert('保存完了');
        resetInput();
        console.log('Document written with ID:', newBook.userId);
        router.push('./list');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Box>
        <Container>
          <Grid container justifyContent="space-between" spacing={2} mt={2}>
            <Grid item>
              <Link href="./list">
                <Button variant="contained" color="error" size="large">
                  キャンセル
                </Button>
              </Link>
            </Grid>
            <Grid item>
              <Button variant="contained" size="large" color="info" onClick={handleClick}>
                投稿する
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2} mt={3} alignItems="Center">
            <Grid item sm={4}>
              <h2>画像アップローダー</h2>
              <Box sx={{ position: 'relative', paddingTop: '100%', overflow: 'hidden' }}>
                <img
                  src={book.picture}
                  alt="本の写真"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                />
              </Box>

              <Box>
                <Button variant="contained" sx={{ fontSize: 'small', p: 1 }}>
                  <input type="file" accept=".png, .jpeg, .jpg" onChange={OnFileUploadToFirebase} />
                </Button>
              </Box>
            </Grid>
            <Grid item sm={8}>
              <Stack spacing={10} sx={{ width: '100%' }}>
                <TextField
                  label="タイトルを入力して下さい"
                  variant="standard"
                  autoComplete="off"
                  value={book.title}
                  onChange={(e) => handleTitleChange(e)}
                />
                <TextField
                  label="作者を入力して下さい"
                  variant="standard"
                  autoComplete="off"
                  value={book.author}
                  onChange={(e) => handleAuthorChange(e)}
                />
                <FormControl>
                  <InputLabel>ジャンルを選択してください</InputLabel>
                  <Select
                    label="Category"
                    variant="standard"
                    value={book.category}
                    onChange={(e) => handleCategoryChange(e)}
                  >
                    <MenuItem value="文学・文芸">文学・文芸</MenuItem>
                    <MenuItem value="ビジネス">ビジネス</MenuItem>
                    <MenuItem value="趣味・実用">趣味・実用</MenuItem>
                    <MenuItem value="専門書">専門書</MenuItem>
                    <MenuItem value="学習参考書">学習参考書</MenuItem>
                    <MenuItem value="絵本">絵本</MenuItem>
                    <MenuItem value="コミックス">コミックス</MenuItem>
                    <MenuItem value="雑誌">雑誌</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ mt: 5 }}>
            <Stack spacing={1}>
              <Box>⭐️おすすめポイント⭐️</Box>
              <TextField
                multiline
                rows={4}
                autoComplete="off"
                value={book.point}
                onChange={(e) => handlePointChange(e)}
              />
            </Stack>
          </Box>
          <Button variant="contained" onClick={handleResetClick} sx={{ mt: 2 }} fullWidth>
            リセット
          </Button>
        </Container>
      </Box>
    </>
  );
}
