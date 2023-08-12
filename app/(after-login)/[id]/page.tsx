'use client';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { BookType } from '@/app/types/BookType';
import { db } from '@/app/service/firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function BookShow() {
  const [books, setBooks] = useState<BookType[]>([]);

  // const router =useRouter()
  // console.log(router)
  const params = useParams();
  console.log(params);
  const bookId = params.id;
  console.log(bookId);

  // const pathname = usePathname()
  // const searchParams = useSearchParams()
  // console.log(pathname)
  // console.log(searchParams)

  // const pathname = usePathname()
  // console.log(pathname)

  const bookToShow = books.find((book) => book.id === bookId);
  // console.log(bookToShow);

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
      <Box>
        <Box>詳細ページ</Box>
        <Container>
          <Box border="1px solid #ccc" borderRadius="5px" padding="10px" marginBottom="10px">
            <Stack spacing={2}>
              <img src={bookToShow?.picture} alt="本の写真" width="100%" height="50%" />
              <Typography>タイトル：「{bookToShow?.title}」</Typography>
              <Typography>著者：「{bookToShow?.author}」</Typography>
              <Typography>ジャンル：「{bookToShow?.category}」</Typography>
              <Typography>⭐️おすすめポイント⭐️：「{bookToShow?.point}」</Typography>
            </Stack>
          </Box>

          <Grid container justifyContent="space-between" spacing={2} mt={2}>
            <Grid item xs={3}>
              <Link href="./list">
                <Button variant="contained">一覧へ</Button>
              </Link>
            </Grid>
            {/* <Grid item xs={3}>
              <Link href="./list">
                <Button variant="contained">楽天サイトページへ</Button>
              </Link>
            </Grid> */}
            <Grid item xs={2}>
              <Link href={`/bookedit?id=${bookId}`}>
                <Button variant="contained">編集ページへ</Button>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
