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
import { Book } from '../../types/book';
import { ChangeEvent, useState } from 'react';

// type BookInfo = Book | null | undefined;

export default function Create() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTitle(e.target.value);
    // console.log(e.target.value)
  };

  const handleAuthorChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAuthor(e.target.value);
    // console.log(e.target.value)
  };

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    setCategory(e.target.value);
    // console.log(e.target.value)
  };

  const resetInput = () => {
    setTitle('');
    setAuthor('');
    setCategory('');
  };

  const handleClick = () => {
    if (!title || !author || !category) {
      alert('タイトル or 著者 or ジャンル が空です');
      return;
    }

    //新しい投稿を作成
    const newBook: Book = {
      id: books.length,
      title: title,
      author: author,
      category: category,
    };

    setBooks([newBook, ...books]);
    resetInput();
  };
  return (
    <>
      <Box>
        <Container>
          <Grid container spacing={2} mt={10}>
            <Grid item xs={4}>
              {/* <TextField multiline rows={11} label="写真を入れる予定" /> */}
              <img
                src="https://cdn2.thecatapi.com/images/6he.jpg"
                alt="写真を入れる予定"
                width={300}
              />
            </Grid>
            <Grid item xs={8}>
              <Stack spacing={2}>
                <TextField
                  label="タイトルを入力して下さい"
                  variant="standard"
                  autoComplete="off"
                  value={title}
                  onChange={(e) => handleTitleChange(e)}
                />
                <TextField
                  label="作者を入力して下さい"
                  variant="standard"
                  autoComplete="off"
                  value={author}
                  onChange={(e) => handleAuthorChange(e)}
                />
                <FormControl>
                  <InputLabel>ジャンルを選択してください</InputLabel>
                  <Select
                    label="Category"
                    variant="standard"
                    value={category}
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
              <TextField multiline rows={4} autoComplete="off" />
            </Stack>
          </Box>
        </Container>
      </Box>
      <Button variant="contained" onClick={handleClick}>
        投稿
      </Button>
      <ul >
        {books.map((book) =>(
          <li key={book.id}>{book.title}</li>
          // <li>{book.author}</li>
          // <li>{book.category}</li>
        ))}
      </ul>
      <Link href="./list">一覧へ</Link>
    </>
  );
}
