'use client';
import { Stack } from '@mui/material';
import Link from 'next/link';

import Tabs from './Tabs';

export default function Home() {
  return (
    <>
      <Stack spacing={2}>
        <Link href="./signup/">新規登録はこちら</Link>
        <Link href="./signin//">ログインはこちら</Link>
      </Stack>

      {/* <Tabs /> */}
    </>
  );
}

// import type { NextPage } from 'next'
// const Home: NextPage = () => {return(<>aaa</>)}
// export default Home
