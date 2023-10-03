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
          {/* <Grid item>
            <Typography
              variant="h3"
              fontStyle="italic"
              color="green"
              sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}
            >
              📖BOOK-TOWN📖
            </Typography>
          </Grid> */}
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
              」は本を読んでみたいけれど何を読んだらいいか分からないという方や、これまで読んだことのないジャンルのおすすめを知りたいという方々の悩みを解決するアプリです。
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ my: 2 }}>
              豊富な書籍情報とユーザーの評価を活用して、個々の興味や嗜好に合った本の提案を行います。さらに他のユーザーがどのような本を読んでいるのかを知ることで、新たな読書のアイデアを得ることができます。未知の世界や新しい知識への探求心を満たすための一歩を、
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
