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
import { ChangeEvent, useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '@/app/service/firebase';
import { BookType } from '@/app/types/BookType';
import { collection, doc, getDoc, getDocs, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuth } from '@/app/context/auth';
import { useRouter } from 'next/navigation';

export default function Create() {
  const [loading, setLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [book, setBook] = useState<BookType>({
    id: '',
    title: '',
    author: '',
    category: '',
    point: '',
    picture: '',
  });

  const router = useRouter();
  const user = useAuth();
  // console.log(user)

  const OnFileUploadToFirebase = (e: { target: { files: any } }) => {
    // console.log(e.target.files[0].name);
    const file = e.target.files[0];
    const storageRef = ref(storage, file.name);
    // const storageRef = ref(storage, 'BookImage/' + file.name);
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
        // setLoading(false);
        // setIsUploaded(true);
        getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          // setPicture(downloadURL);
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
      id: '',
      title: '',
      author: '',
      category: '',
      point: '',
      picture: '',
    });
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // setTitle(e.target.value);
    setBook((prevBook) => ({
      ...prevBook,
      title: e.target.value,
    }));
  };

  const handleAuthorChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // setAuthor(e.target.value);
    setBook((prevBook) => ({
      ...prevBook,
      author: e.target.value,
    }));
  };

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    // setCategory(e.target.value);
    setBook((prevBook) => ({
      ...prevBook,
      category: e.target.value,
    }));
  };

  const handlePointChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // setPoint(e.target.value);
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
      id: user.user.id,
      title: book.title,
      author: book.author,
      category: book.category,
      point: book.point,
      picture: book.picture,
    };

    await setDoc(newBookRef, newBook)
      .then(() => {
        alert('保存完了');
        resetInput();
        console.log('Document written with ID:', newBook.id);
      })
      .catch((error) => {
        console.error(error);
      });
    router.push('./list');
  };

  // const handleTitleEditChange = () => {};

  useEffect(() => {
    //データを取得
    const booksCollectionRef = collection(db, 'books');
    // console.log(booksCollectionRef);
    getDocs(booksCollectionRef).then((QuerySnapshot) => {
      // setBook(QuerySnapshot.docs.map((doc) => ({ ...doc.data() })));
      console.log(QuerySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      // snapshot.docs.forEach((doc)=>console.log(doc.data()))
      //リアルタイムで取得
      // onSnapshot(booksCollectionRef, (book) => {
      //   setBooks(book.docs.map((doc) => ({ ...doc.data() })));
      // });
      console.log('mount');
    });
  }, []);

  return (
    <>
      {/* <div>
      {user ? (
        <p>User ID: {user.user.id}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div> */}
      {/* {loading ? ( */}
      {/* <h2>アップロード中・・・</h2> */}
      {/* ) : ( */}
      <>
        {/* {isUploaded ? ( */}
        {/* <h2>アップロード完了しました</h2> */}
        {/* ) : ( */}
        <>
          <Box>
            <Container>
              {/* {book.title} */}
              {/* {user.user.id} */}
              <Grid container spacing={2} mt={10}>
                <Grid item xs={4}>
                  <h2>画像アップローダー</h2>
                  <p>JpegかPngの画像ファイル</p>
                  <Box>
                    <Button variant="contained">
                      ファイルを選択
                      <input
                        type="file"
                        accept=".png, .jpeg, .jpg"
                        onChange={OnFileUploadToFirebase}
                      />
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={8}>
                  <Stack spacing={2}>
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
            </Container>
          </Box>

          <Box>
            <Button variant="contained" onClick={handleClick}>
              投稿
            </Button>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Button variant="contained" onClick={handleResetClick}>
              リセット
            </Button>
          </Box>
          {/* {book.title && (
            <li key={book.id}>
              <Box>タイトル</Box>
              <TextField
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
              {book.picture && <img src={book.picture} alt="本の写真" width="25%" />}
            </li>
          )} */}

          <Link href="./list">一覧へ</Link>
        </>
        {/* )} */}
      </>
      {/* )} */}
    </>
  );
}
