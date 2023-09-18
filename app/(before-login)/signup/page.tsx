'use client';
import { auth, db, storage } from '@/app/service/firebase';
import { Avatar, Box, Button, Container, Grid, Stack, TextField } from '@mui/material';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUp() {
  const [name, setName] = useState<string>('');
  const [userURL, setUserURL] = useState<string>('');
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Firebase Authenticationを使用して、ユーザーの表示名を更新
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: userURL,
      });

      // ユーザーのFirestoreデータベースに新しいドキュメントを作成
      const userRef = doc(db, 'users', userCredential.user.uid);
      const appUser = {
        id: userCredential.user.uid,
        name: name,
        photoURL: userCredential.user.photoURL,
        email: email,
        createdAt: Date.now(),
        likeCount: 0,
      };
      await setDoc(userRef, appUser);
      console.log('ユーザーが作成されました');
      console.log(appUser);
      router.push('/signin');

      // フォームのステートをリセット
      setName('');
      setEmail('');
      setPassword('');
      setError('');
      setUserURL('');
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

  const OnFileUploadToFirebase = (e: { target: { files: any } }) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, file.name);
    const uploadImage = uploadBytesResumable(storageRef, file);

    uploadImage.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
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
        getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          setUserURL(downloadURL);
        });
      }
    );
  };

  return (
    <>
      <Container maxWidth="md" sx={{ pt: 5 }}>
        <h2>新規登録</h2>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Stack spacing={2}>
            <p>イメージ画像（JpegかPngの画像ファイル）</p>
            <Stack direction="row" justifyContent="flex-start" spacing={2}>
              <Avatar alt="" src={userURL} />
              <Button variant="contained">
                <input type="file" accept=".png, .jpeg, .jpg" onChange={OnFileUploadToFirebase} />
              </Button>
            </Stack>
            <Box>画像を設定しない場合は、デフォルト画像がアイコンになります。</Box>
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

            <Grid item xs={3}>
              <Link href="/">
                <Button size="large" variant="contained">
                  homeへ戻る
                </Button>
              </Link>
            </Grid>

            <Grid item xs={2}>
              <Link href="/signin">
                <Button variant="contained">ログインへ</Button>
              </Link>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}
