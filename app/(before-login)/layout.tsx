'use client';

import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  session: any;
}

export default function RootLayout({ children }: IProps) {
  return (
    <>
        <div>{children}</div>
    </>
  );
}
