import React from 'react';
import { Container, Box, Button } from '@mui/material';
import CircularColor from '@/app/CircularColor';

function LoadingIndicator() {
  const handleReload = () => {
    //     // ページをリロードする
    window.location.reload();
  };
  return (
    <Container
      sx={{
        mt: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        ローディング中...
        <CircularColor />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '1rem', // 適切なマージンを設定
          }}
        >
          <Box sx={{ flexGrow: 1 }}>ローディングが終わらない場合。。。</Box>
          <Button variant="contained" onClick={handleReload}>
            リロード
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default LoadingIndicator;

// import CircularColor from '@/app/CircularColor';
// import { useAuth } from '@/app/context/auth';
// import { auth } from '@/app/service/firebase';
// import { Box, Button, Container } from '@mui/material';
// import { onAuthStateChanged } from 'firebase/auth';
// import { useEffect, useState } from 'react';

// function MyComponent() {
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // ユーザー情報を取得する非同期処理
//     // ユーザー情報が取得されたら setIsLoading(false) を呼び出す

//     // 例: FirebaseのonAuthStateChangedを使用した場合
//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       if (firebaseUser) {
//         // ユーザー情報が取得できた場合
//         setIsLoading(false);
//       } else {
//         // ユーザー情報が取得できなかった場合
//         setIsLoading(false);
//       }
//     });

//     // ページがアンマウントされたときに監視を解除
//     return () => unsubscribe();
//   }, []);

//   const handleReload = () => {
//     // ページをリロードする
//     window.location.reload();
//   };

//   if (isLoading) {
//     return (
//       <>
//         <Container
//           sx={{
//             mt: 3,
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             minHeight: '100vh',
//           }}
//         >
//           <Box>
//             ローディング中...
//             <Button variant="contained" onClick={handleReload}>
//               リロード
//             </Button>
//           </Box>
//           <CircularColor />
//         </Container>
//       </>
//     );
//   }

//   // ユーザー情報が取得されたら、実際のコンテンツを表示
//   return (
//     // ユーザー情報がある場合のコンポーネントの内容
//   );
// }
