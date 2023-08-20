'use client';
import { db } from '@/app/service/firebase';
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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';

export default function BookEdit({ searchParams }: { searchParams: { id: string } }) {
  const [editBooks, setEditBooks] = useState<BookType[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPoint, setNewPoint] = useState('');

  const router = useRouter();
  const bookId = searchParams.id;
  // console.log(bookId);

  const handleEditTitleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // console.log(e.target.value);
    setNewTitle(e.target.value);
  };

  const handleEditAuthorChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // console.log(e.target.value);
    setNewAuthor(e.target.value);
  };

  const handleEditCategoryChange = (e: SelectChangeEvent<string>) => {
    // console.log(e.target.value);
    setNewCategory(e.target.value);
  };

  const handleEditPointChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewPoint(e.target.value);
  };

  // const bookToEdit = editBooks.find((editBook) => editBook.docId === bookId);
  const bookToEdit = editBooks.find((editBook) => editBook.docId === bookId);
  // console.log(editBooks);
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
        };
      });
      // console.log(fetchedBooks);
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
        };
      });
      // console.log(updatedBooks)
      setEditBooks(updatedBooks);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setNewTitle(bookToEdit?.title || '');
    setNewAuthor(bookToEdit?.author || '');
    setNewCategory(bookToEdit?.category || '');
    setNewPoint(bookToEdit?.point || '');
  }, [editBooks]);

  const handleSaveClick = async () => {
    if (!newTitle || !newAuthor || !newCategory || !newPoint) {
      alert('「タイトルor著者orジャンルor⭐️おすすめポイント⭐️」が未入力です。');
    }

    try {
      if (newDocRef) {
        // const newDocRef = doc(db, 'books', bookDocId);
        // const newDocRef = doc(db, 'books', bookId);
        await updateDoc(newDocRef, {
          title: newTitle,
          author: newAuthor,
          category: newCategory,
          point: newPoint,
        });
        console.log('更新されました');
        router.push('/list');
      }
    } catch (error) {
      console.log('保存に失敗しました');
    }
  };

  return (
    <>
      <Box>
        <Box>編集ページ</Box>
        <Container>
          <Grid container spacing={2} mt={10}>
            {/* <Grid item xs={4}>
              <h2>画像アップローダー</h2>
              <p>JpegかPngの画像ファイル</p>
              <Box>
                <Button variant="contained">
                  ファイルを選択
                  <input
                    type="file"
                    accept=".png, .jpeg, .jpg"
                    // onChange={OnFileUploadToFirebase}
                  />
                </Button>
              </Box>
            </Grid> */}
            <Grid item xs={8}>
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

          <Grid container justifyContent="space-between" spacing={2} mt={2}>
            <Grid item xs={2}>
              <Link href="./list">
                <Button variant="contained">一覧に戻る</Button>
              </Link>
            </Grid>

            <Grid item xs={1}>
              <Button variant="contained" onClick={handleSaveClick}>
                編集保存
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
