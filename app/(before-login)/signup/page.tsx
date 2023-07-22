'use client';
import { auth, db } from '@/app/service/firebase';
import { Button, Container, Grid, Stack, TextField } from '@mui/material';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUp() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const router = useRouter();

  // Firebase Authenticationのエラーコードを列挙したカスタムのエラータイプを作成
  type FirebaseAuthErrorCode =
    | 'auth/invalid-email'
    | 'auth/weak-password'
    | 'auth/email-already-in-use';

  // カスタムのエラーオブジェクト型を定義
  interface FirebaseAuthError {
    code: FirebaseAuthErrorCode;
    message: string;
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      // Firebase Authenticationを使用して、メールとパスワードで新しいユーザーを作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // console.log(userCredential);

      // Firebase Authenticationを使用して、ユーザーの表示名を更新
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // ユーザーのFirestoreデータベースに新しいドキュメントを作成
      const userRef = doc(db, 'users', userCredential.user.uid);
      const appUser = {
        id: userCredential.user.uid,
        name: name,
        photoURL: userCredential.user.photoURL, // 必要に応じてカスタムのphotoURLに更新できます。
        email: email,
        createdAt: Date.now(),
      };
      await setDoc(userRef, appUser);
      console.log(appUser);
      console.log('ユーザーが作成されました');
      router.push('/signin');

      // フォームのステートをリセット
      setName('');
      setEmail('');
      setPassword('');
      setError('');
    } catch (error: unknown) {
      // ユーザー作成が失敗した場合の処理
      if (isFirebaseAuthError(error)) {
        console.error(error.code);
        switch (error.code) {
          case 'auth/invalid-email':
            setError('正しいメールアドレスの形式で入力してください。');
            break;
          case 'auth/weak-password':
            setError('パスワードは6文字以上を設定する必要があります。');
            break;
          case 'auth/email-already-in-use':
            setError('そのメールアドレスは登録済みです。');
            break;
          default:
            setError('メールアドレスかパスワードに誤りがあります。');
            break;
        }
      }
    }
  };

  // FirebaseAuthErrorの型ガードを定義
  //errorオブジェクトがobject型であり、nullではなく、codeプロパティを持つ場合にのみスイッチ文の中に入る
  function isFirebaseAuthError(error: unknown): error is FirebaseAuthError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof error.code === 'string'
    );
  }

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  return (
    <>
      <Container maxWidth="md" sx={{ pt: 5 }}>
        <h2>登録ページ</h2>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Stack spacing={2}>
            <p>名前</p>
            <TextField
              id="name"
              label="名前を入力してください"
              variant="outlined"
              fullWidth
              autoComplete="off"
              name="name"
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChangeName(e);
              }}
            />
            <p>メールアドレス</p>
            <TextField
              id="email"
              label="メールアドレスを入力してください"
              variant="outlined"
              fullWidth
              autoComplete="off"
              name="email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChangeEmail(e);
              }}
            />
            <p>パスワード</p>
            <TextField
              id="password"
              label="パスワードを入力してください"
              variant="outlined"
              fullWidth
              autoComplete="off"
              name="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChangePassword(e);
              }}
            />
          </Stack>

          <Grid container justifyContent="space-between" spacing={2} mt={2}>
            <Grid item xs={2}>
              <Button variant="contained" size="large" type="submit">
                新規登録
              </Button>
            </Grid>

            <Grid item xs={2}>
              <Link href="/signin">
                <Button variant="contained">ログインへ</Button>
              </Link>
            </Grid>
          </Grid>
        </form>
      </Container>

      <Link href="/">homeへ戻る</Link>
    </>
  );
}
