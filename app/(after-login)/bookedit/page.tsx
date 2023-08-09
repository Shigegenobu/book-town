'use client';
import { db } from '@/app/service/firebase';
import { BookType } from '@/app/types/BookType';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BookEdit() {
  const [bookId, setBookId] = useState<BookType[]>([]);

  // useEffect(() => {
  //   // firebaseからデータを取得
  //   const bookData = collection(db, 'books');
  //   getDocs(bookData).then((snapShot) => {
  //     const fetchedBooks = snapShot.docs.map((doc) => {
  //       const data = doc.data();
  //       return {
  //         id: doc.id,
  //         title: data.title,
  //         author: data.author,
  //         category: data.category,
  //         point: data.point,
  //         picture: data.picture,
  //       };
  //     });
  //     // console.log(fetchedBooks);
  //     setBookId(fetchedBooks);
  //   });
  //   // リアルタイムで取得
  //   const unsubscribe = onSnapshot(bookData, (book) => {
  //     const updatedBooks = book.docs.map((doc) => {
  //       const data = doc.data();
  //       return {
  //         id: doc.id,
  //         title: data.title,
  //         author: data.author,
  //         category: data.category,
  //         point: data.point,
  //         picture: data.picture,
  //       };
  //     });
  //     setBookId(updatedBooks);
  //   });

  //   return () => unsubscribe();
  // }, []);

  // useEffect(() => {
  //   console.log(bookId);
  // }, [bookId]);

  // const router = useRouter();
  // const [isRouterReady, setIsRouterReady] = useState(false);

  // useEffect(() => {
  //   if (router.isReady) {
  //     setIsRouterReady(true);
  //   }
  // }, [router]);

  // useEffect(() => {
  //   if (isRouterReady) {
  //     const docRef = doc(db, "books", router.query.id);
  //     const docSnap = getDoc(docRef);
  //     docSnap.then((ref) => {
  //       setBookId(ref.data());
  //     });
  //   }
  // }, [isRouterReady, router.query.id]);

  return (
    <>
      <Box>
        <Box>編集ページ</Box>
        <Container>
          <Stack spacing={2}>
            <TextField label="タイトルを入力して下さい" variant="standard" autoComplete="off" />
            <TextField label="作者を入力して下さい" variant="standard" autoComplete="off" />
            <TextField label="出版社を入力して下さい" variant="standard" autoComplete="off" />
            <FormControl>
              <InputLabel>ジャンルを選択してください</InputLabel>
              <Select label="Category" variant="standard">
                <MenuItem value="ミステリー（推理小説）">ミステリー（推理小説）</MenuItem>
                <MenuItem value="ファンタジー">ファンタジー</MenuItem>
                <MenuItem value="歴史小説">歴史小説</MenuItem>
                <MenuItem value="短編小説">短編小説</MenuItem>
                <MenuItem value="ノンフィクション">ノンフィクション</MenuItem>
                <MenuItem value="図鑑">図鑑</MenuItem>
                <MenuItem value="エッセイ（随筆）">エッセイ（随筆）</MenuItem>
                <MenuItem value="その他">その他</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Box sx={{ mt: 5 }}>
            <Stack spacing={1}>
              <Box>⭐️おすすめポイント⭐️</Box>
              <TextField multiline rows={4} autoComplete="off" />
            </Stack>
          </Box>

          <Grid container justifyContent="space-between" spacing={2} mt={2}>
            <Grid item xs={2}>
              <Link href="./list">
                <Button variant="contained">リストへ戻る</Button>
              </Link>
            </Grid>

            <Grid item xs={1}>
              <Link href="./list">
                <Button variant="contained">保存</Button>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
