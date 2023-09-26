'use client';
import { auth } from '@/app/service/firebase';
import { Box, Button, Container, Grid, TextField } from '@mui/material';
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
      <Container sx={{ width: '75%' }}>
        <h2>ログインページ</h2>

        <form onSubmit={handleSubmit}>
          <Box>
            <p>メールアドレス</p>
            <TextField
              label="メールアドレスを入力してください"
              variant="outlined"
              fullWidth
              autoComplete="off"
              name="email"
              type="email"
            />
            <p>パスワード</p>
            <TextField
              id="outlined-basic"
              label="パスワードを入力してください"
              variant="outlined"
              fullWidth
              autoComplete="off"
              name="password"
              type="password"
            />
          </Box>

          <Grid container justifyContent="space-between" spacing={2} mt={2}>
            <Grid item>
              <Button variant="contained" type="submit">
                ログイン
              </Button>
            </Grid>

            <Grid item>
              <Link href="./signup">
                <Button variant="contained"> 新規登録</Button>
              </Link>
            </Grid>

            <Grid item>
              <Link href="/">
                <Button size="large" variant="contained">
                  HOME
                </Button>
              </Link>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}
