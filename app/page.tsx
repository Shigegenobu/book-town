'use client';
import { Box, Button, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Box>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box style={{ width: '100%', paddingBottom: '100%', position: 'relative' }}>
              <Image src="/./bookImage.png" alt="book picture" objectFit="contain" layout="fill" />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box style={{ width: '100%', paddingBottom: '100%', position: 'relative' }}>
              <Image src="/./bookImage2.png" alt="book picture" objectFit="contain" layout="fill" />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box style={{ width: '100%', paddingBottom: '100%', position: 'relative' }}>
              <Image src="/./bookImage3.png" alt="book picture" objectFit="contain" layout="fill" />
            </Box>
          </Grid>
        </Grid>
        <Typography gutterBottom variant="h5">
          📕BOOK-TOWNへようこそ📕
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ my: 2 }}>
          「BOOK-TOWN」は、本を読んでみたいけれど何を読んだらいいか分からないという方や、これまで読んだことのないジャンルのおすすめを知りたいという方々の悩みを解決するアプリです。
          <br />
          豊富な書籍情報とユーザーの評価を活用して、個々の興味や嗜好に合った本の提案を行います。さらに、他のユーザーがどのような本を読んでいるのかを知ることで、新たな読書のアイデアを得ることができます。未知の世界や新しい知識への探求心を満たすための一歩を、BOOK-TOWNがサポートします!
        </Typography>
        <Box>
          <Link href="./signin/">
            <Button size="large" variant="contained" sx={{ mr: 2 }}>
              ログインはこちら
            </Button>
          </Link>
          <Link href="./signup/">
            <Button size="large" variant="contained">
              新規登録はこちら
            </Button>
          </Link>
        </Box>
      </Box>
    </>
  );
}
