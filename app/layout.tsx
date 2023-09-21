'use client';

import theme from '@/theme';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
import { AuthProvider } from './context/auth';

interface IProps {
  children: ReactNode;
  session: any;
}

export default function RootLayout({ children }: IProps) {
  return (
    <AuthProvider>
      <html lang="en">
        <head />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <body suppressHydrationWarning={true}>
            <div>{children}</div>
          </body>
        </ThemeProvider>
      </html>
    </AuthProvider>
  );
}
