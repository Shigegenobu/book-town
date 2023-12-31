'use client';
import { auth } from '@/app/service/firebase';
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();

  const handleSubmit = (event: any) => {
    console.log(event);
    event.preventDefault();

    const { email, password } = event.target.elements;
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((user) => {
        // console.log('ログイン成功=', user.user.uid);
        // console.log(user);

        router.push('./mypage');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Container maxWidth="md" sx={{ pt: 5 }}>
        <h2>ログイン</h2>
        <form onSubmit={handleSubmit}>
          <Box>
            <TextField
              label="メールアドレスを入力してください"
              variant="outlined"
              fullWidth
              autoComplete="off"
              name="email"
              type="email"
            />
            <TextField
              id="outlined-basic"
              label="パスワードを入力してください"
              variant="outlined"
              fullWidth
              autoComplete="off"
              name="password"
              type="password"
              sx={{ mt: 3 }}
            />
            <Button variant="contained" type="submit" fullWidth sx={{ mt: 3 }}>
              ログイン
            </Button>
          </Box>

          <Grid container justifyContent="space-between" spacing={2} mt={3}>
            <Grid item>
              <Link href="./signup">アカウントをお持ちでない方はこちら</Link>
            </Grid>

            <Grid item>
              <Link href="/">
                <Button variant="contained" sx={{ backgroundColor: '#FFD97E' }}>
                  戻る
                </Button>
              </Link>
            </Grid>
          </Grid>
        </form>

        <Typography sx={{ mt: 10 }} variant="h6">
          テストユーザー
        </Typography>
        <Box
          border={1}
          borderRadius={3}
          p={2}
          mt={1}
          sx={{
            backgroundColor: '#f0f4c3',
            '@media (min-width: 768px)': {
              width: '30%',
            },
          }}
        >
          <Grid container justifyContent="flex-start" spacing={3}>
            <Grid item>
              <Box>メールアドレス</Box>
              <Box>test@gmail.com</Box>
            </Grid>
            <Grid item>
              <Box>パスワード</Box>
              <Box>123456</Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
