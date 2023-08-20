'use client';

import { ReactNode, Suspense } from 'react';
import ResponsiveAppBar from '../ResponsiveAppBar';
import UserGuard from '../guards/user-guard';

interface IProps {
  children: ReactNode;
  session: any;
}

export default function RootLayout({ children }: IProps) {
  return (
    <>
      <UserGuard>
        <ResponsiveAppBar />
        {/* <Suspense> */}
        <div>{children}</div>
        {/* </Suspense> */}
      </UserGuard>
    </>
  );
}
