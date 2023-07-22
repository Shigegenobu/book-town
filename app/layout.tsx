'use client';

import theme from '@/theme';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ReactNode, useState } from 'react';
import { AuthProvider } from './context/auth';

interface IProps {
  children: ReactNode;
  session: any;
}

export default function RootLayout({ children }: IProps) {
  const [count, setCount] = useState(0);

  return (
    <AuthProvider>
      <html lang="en">
        <head />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <body suppressHydrationWarning={true}>
            <div>{children}</div>

            {/* <div>{count}</div>
            <button
              onClick={() => {
                setCount(count + 1);
              }}
            >
              +
            </button> */}
          </body>
        </ThemeProvider>
      </html>
    </AuthProvider>
  );
}
