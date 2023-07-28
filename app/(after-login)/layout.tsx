'use client';

import { ReactNode } from 'react';
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

        <div>{children}</div>
      </UserGuard>
    </>
  );
}
