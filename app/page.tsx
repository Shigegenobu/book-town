'use client';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Container>
        <Grid container justifyContent="right" spacing={2} mt={2}>
          <Grid item>
            <Link href="./signin/">
              <Button size="large" variant="contained" color="success" sx={{ mr: 2, mb: 3 }}>
                ログイン
              </Button>
            </Link>
          </Grid>
          <Grid item>
            <Link href="./signup/">
              <Button size="large" variant="contained" sx={{ mb: 3 }}>
                新規登録
              </Button>
            </Link>
          </Grid>
        </Grid>

        <Box>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={4}>
              <Box style={{ width: '100%', paddingBottom: '100%', position: 'relative' }}>
                <Image src="/bookImage.png" alt="book picture" objectFit="contain" layout="fill" />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box style={{ width: '100%', paddingBottom: '100%', position: 'relative' }}>
                <Image
                  src="/bookImage2.png"
                  alt="book picture2"
                  objectFit="contain"
                  layout="fill"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box style={{ width: '100%', paddingBottom: '100%', position: 'relative' }}>
                <Image
                  src="/bookImage3.png"
                  alt="book picture3"
                  objectFit="contain"
                  layout="fill"
                />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 8 }}>
            <Typography
              gutterBottom
              variant="h5"
              sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}
            >
              <Box component="span" fontStyle="italic" color="green" fontWeight="bold">
                BOOK-TOWN
              </Box>
              にようこそ📗
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ my: 2 }}>
              「
              <Box component="span" fontStyle="italic" color="green" fontWeight="bold">
                BOOK-TOWN
              </Box>
              」は自分のおすすめの本を投稿したり、他人が投稿したおすすめの本を閲覧できるアプリです。
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ my: 2 }}>
              他人のおすすめした本を見ることで、新しいジャンルや分野に興味を持つことができ、知識や読書の幅が広がります。本を読みたいけれど、何を読んだらいいか分からない方や、これまで読んだことのないジャンルのおすすめを知りたい方々の悩みを解決するツールとなっています。未知の世界や新しい知識への探求心を満たすための一歩を、
              <Box component="span" fontStyle="italic" color="green" fontWeight="bold">
                BOOK-TOWN
              </Box>
              がサポートします!
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 7 }}>
          <Link href="./signup/">
            <Button size="large" variant="contained" color="warning" sx={{ mb: 3 }}>
              新規登録はこちら <ArrowForwardIosIcon sx={{ ml: 8 }} />
            </Button>
          </Link>
        </Box>
      </Container>
    </>
  );
}
