'use client';
import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '../../service/firebase';
import { useAuth } from '@/app/context/auth';
import { useEffect } from 'react';

export default function Mypage() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('sign-out successful.');
        router.push('/signin');
        setUser(undefined);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <>
      <Box>Mypage</Box>

      <Container>
        <Box>ログイン中の人しか見れないページ</Box>
        <Box>
          <Typography sx={{ fontWeight: 'bold', color: 'orange' }}>名前</Typography>
          <Typography>{user?.name}</Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontWeight: 'bold', color: 'orange' }}>ID</Typography>
          <Typography>{user?.id}</Typography>
        </Box>

        <Box sx={{ my: 3 }}>
          <Typography sx={{ fontWeight: 'bold', color: 'orange' }}>email</Typography>
          <Typography>{user?.email}</Typography>
        </Box>
        <Stack spacing={2}>
          <Link href="./list">
            <Button variant="contained">一覧へ</Button>
          </Link>

          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{ width: 200, padding: 1, margin: 2 }}
          >
            ログアウト
          </Button>
        </Stack>

        <Box>
          <Box>自分の投稿した内容</Box>
          <TextField />
        </Box>
        <br />
        <Link href="./create">
          <Button variant="contained">投稿する</Button>
        </Link>
      </Container>
    </>
  );
}
