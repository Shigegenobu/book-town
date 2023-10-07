'use client';
import { db, storage } from '@/app/service/firebase';
import { BookType } from '@/app/types/BookType';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  DocumentReference,
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';

export default function BookEdit({ searchParams }: { searchParams: { id: string } }) {
  const [editBooks, setEditBooks] = useState<BookType[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPoint, setNewPoint] = useState('');
  const [newPicture, setNewPicture] = useState('');

  const router = useRouter();
  const bookId = searchParams.id;

  const handleEditTitleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTitle(e.target.value);
  };

  const handleEditAuthorChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewAuthor(e.target.value);
  };

  const handleEditCategoryChange = (e: SelectChangeEvent<string>) => {
    setNewCategory(e.target.value);
  };

  const handleEditPointChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewPoint(e.target.value);
  };

  const bookToEdit = editBooks.find((editBook) => editBook.docId === bookId);
  // console.log(bookToEdit);

  const bookDocId = bookToEdit?.docId;
  console.log(bookDocId);

  let newDocRef: DocumentReference | undefined; // doc()関数のための変数を宣言

  if (bookToEdit) {
    newDocRef = doc(db, 'books', bookToEdit.docId);
  }

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
          likeCount: data.likeCount,
        };
      });
      setEditBooks(fetchedBooks);
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
          likeCount: data.likeCount,
        };
      });
      setEditBooks(updatedBooks);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setNewTitle(bookToEdit?.title || '');
    setNewAuthor(bookToEdit?.author || '');
    setNewCategory(bookToEdit?.category || '');
    setNewPoint(bookToEdit?.point || '');
    setNewPicture(bookToEdit?.picture || '');
  }, [editBooks]);

  const handleSaveClick = async () => {
    if (!newTitle || !newAuthor || !newCategory || !newPoint) {
      alert('「タイトルor著者orジャンルor⭐️おすすめポイント⭐️」が未入力です。');
      return;
    }

    try {
      if (newDocRef) {
        await updateDoc(newDocRef, {
          title: newTitle,
          author: newAuthor,
          category: newCategory,
          point: newPoint,
          picture: newPicture,
        });
        console.log('更新されました');
        router.push('/list');
      }
    } catch (error) {
      console.log('保存に失敗しました');
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

          setNewPicture(downloadURL);
        });
      }
    );
  };

  return (
    <>
      <Box>
        <Container>
          <Grid container justifyContent="space-between" spacing={2} mt={2}>
            <Grid item>
              <Link href="./list">
                <Button variant="contained" size="large" color="error">
                  キャンセル
                </Button>
              </Link>
            </Grid>

            <Grid item>
              <Button variant="contained" size="large" color="info" onClick={handleSaveClick}>
                保存
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2} mt={5} alignContent="center">
            <Grid item xs={12} sm={4}>
              <h2>画像アップローダー</h2>
              <Box sx={{ position: 'relative', paddingTop: '100%', overflow: 'hidden' }}>
                <img
                  src={newPicture}
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
              </Box>
              <Box sx={{ mt: 3 }}>
                <Button variant="contained">
                  <input type="file" accept=".png, .jpeg, .jpg" onChange={OnFileUploadToFirebase} />
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Stack spacing={2}>
                <Typography>タイトル</Typography>
                <TextField
                  variant="outlined"
                  autoComplete="off"
                  value={newTitle}
                  onChange={(e) => handleEditTitleChange(e)}
                />

                <Typography>著者</Typography>
                <TextField
                  variant="outlined"
                  autoComplete="off"
                  value={newAuthor}
                  onChange={(e) => handleEditAuthorChange(e)}
                />

                <FormControl>
                  <Typography>ジャンル</Typography>

                  <Select
                    label="Category"
                    variant="outlined"
                    value={newCategory}
                    onChange={(e) => handleEditCategoryChange(e)}
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
                value={newPoint}
                onChange={(e) => handleEditPointChange(e)}
              />
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
}
