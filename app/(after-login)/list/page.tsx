'use client';
import { Box, Button, Container, Grid, Stack, TextField } from '@mui/material';
import Link from 'next/link';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';

export default function List() {
  return (
    <>
      <Container>
        <Box>
          <Box>この部分に投稿された内容が入る予定</Box>
          <Stack spacing={2}>
            <TextField label="タイトル入力欄" variant="standard" autoComplete="off" />
            <TextField label="作者を入力欄" variant="standard" autoComplete="off" />
            <TextField label="出版社入力欄" variant="standard" autoComplete="off" />
            <TextField label="ジャンル入力欄" variant="standard" autoComplete="off" />
          </Stack>
          <br />
          <br />
          <br />
          <Box>
            <MenuBookTwoToneIcon />
          </Box>
        </Box>
      </Container>
      <Box>
        <Grid container justifyContent="space-between" spacing={2} mt={2}>
          <Grid item >
            <Link href="./bookshow/">
              <Button variant="contained">詳細ページへ</Button>
            </Link>
          </Grid>
          <Grid item >
            <Link href="./create/">
              <Button variant="contained">投稿する</Button>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
