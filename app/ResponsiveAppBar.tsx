import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useAuth } from './context/auth';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from './service/firebase';
import Link from 'next/link';

const settings = ['MyPage', 'List'];

function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('sign-out successful.');
        router.push('/signin');
        setUser(undefined);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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
            href="./list"
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

          {/* <Avatar alt="" src={user?.photoURL} /> */}

          <Box
            sx={{ flexGrow: 0, height: '80px' }}
            display={'flex'}
            justifyContent={'space-between'}
            alignItems="center"
          >
            <Box sx={{ mr: 10 }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleLogout}
                sx={{ width: 100, padding: 1 }}
              >
                ログアウト
              </Button>
            </Box>

            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="" src={user?.photoURL} sizes="large" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Link
                    style={{ textDecoration: 'none', color: 'black' }}
                    href={`/${setting.toLowerCase()}`}
                    passHref
                  >
                    <Typography
                      textAlign="center"
                      sx={{ padding: '8px'}}
                      onClick={() => console.log('Link clicked')}
                    >
                      {setting}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
