import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';

import { useAuth } from './context/auth';

function ResponsiveAppBar() {
  const { user } = useAuth();

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems="center"
          sx={{ height: '80px' }}
        >
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="./mypage"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            📖BOOKTOWN📖
          </Typography>

          <Avatar alt="" src={user?.photoURL} />
        </Box>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
