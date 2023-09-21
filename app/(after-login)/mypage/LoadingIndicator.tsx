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
            marginTop: '1rem',
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
