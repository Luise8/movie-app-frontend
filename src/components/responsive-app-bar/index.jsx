/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { Alert, Collapse } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import linkRoutes from 'src/utils/link-routes';
import appResourcesPath from 'src/utils/app-resources-path';
import 'src/components/responsive-app-bar/styles.css';
import ModalNotification from 'src/components/modal-notification';
import ModalGenre from 'src/components/modal-genre';
import ModalSearch from 'src/components/modal-search';
import BackToTop from 'src/components/back-to-top';
import { useUserAuth } from 'src/context/auth';

function ResponsiveAppBar() {
  const { user, logOutContext: logOut } = useUserAuth();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [modalLogOut, setModalLogOut] = useState(false);
  const [modalGenre, setModalGenre] = useState(false);
  const [modalSearch, setModalSearch] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [genres, setGenres] = useState([]);

  const navigate = useNavigate();
  const theme = useTheme();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenModalGenre = () => {
    setModalGenre(true);
    setAnchorElNav(null);
  };

  const handleCloseModalGenre = () => {
    setGenres([]);
    setModalGenre(false);
  };
  const handleOpenModalSearch = () => {
    setModalSearch(true);
  };

  const handleCloseModalSearch = () => {
    setModalSearch(false);
  };

  const handleChangeGenre = (event, value) => {
    setGenres(value);
  };

  const handleConfirmModalGenre = (event) => {
    event.preventDefault();
    navigate(`/genre/${genres.map((item) => item.id.toString()).join()}`);
    setModalGenre(false);
  };

  const handleCloseModalLogOut = () => {
    setModalLogOut(false);
  };

  async function handleLogOut(event) {
    event.preventDefault();
    try {
      await logOut();
      navigate('/');
      handleCloseUserMenu();
      setModalLogOut(true);
    } catch (error) {
      setOpenAlert(true);
      handleCloseNavMenu();
      handleCloseUserMenu();
    }
  }

  return (
    <>
      <AppBar
        id="responsive-app-bar"
        className="responsive-app-bar"
        data-testid="responsive-app-bar"
      >
        <Container
          className="responsive-app-bar-container"
          data-testid="responsive-app-bar-container"
        >
          <Toolbar disableGutters>
            {/* START MD (900) LEFT MENU */}
            {/* START MD (900) HAMBURGER */}
            <Box data-testid="responsive-app-bar-hamburger" className="responsive-app-bar-hamburger">
              <IconButton
                size="large"
                aria-label="filter of movies"
                aria-controls="menu-filter-movies"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-filter-movies"
                data-testid="menu-filter-movies"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
              >
                <MenuItem component={Link} key="Rated" onClick={handleCloseNavMenu} to={linkRoutes.responsiveAppBar.rated}>
                  Rated
                </MenuItem>
                <MenuItem component={Link} key="Popular" onClick={handleCloseNavMenu} to={linkRoutes.responsiveAppBar.popular}>
                  Popular
                </MenuItem>
                <MenuItem component={Link} key="Trending" onClick={handleCloseNavMenu} to={linkRoutes.responsiveAppBar.trending}>
                  Trending
                </MenuItem>
                <MenuItem key="Genre" onClick={handleOpenModalGenre}>
                  Genre
                </MenuItem>
              </Menu>
            </Box>
            {/* END MD (900) HAMBURGER */}
            <AdbIcon
              className="responsive-app-bar-app-icon-md900"
              data-testid="responsive-app-bar-app-icon-md900"
            />
            <Typography
              className="responsive-app-bar-logo-text-md900"
              data-testid="responsive-app-bar-logo-text-md900"
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{
                color: 'inherit',
              }}
            >
              LOGO
            </Typography>
            {/* END MD (900) LEFT MENU */}
            <AdbIcon
              className="responsive-app-bar-app-icon"
              data-testid="responsive-app-bar-app-icon"
            />
            <Typography
              className="responsive-app-bar-logo-text"
              data-testid="responsive-app-bar-logo-text"
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                color: 'inherit',
              }}
            >
              LOGO
            </Typography>
            <Box
              className="responsive-app-bar-container-left-buttons"
              data-testid="responsive-app-bar-container-left-buttons"
            >
              <Button
                key="Rated"
                component={Link}
                to={linkRoutes.responsiveAppBar.rated}
                onClick={handleCloseNavMenu}
              >
                Rated
              </Button>
              <Button
                key="Popular"
                component={Link}
                to={linkRoutes.responsiveAppBar.popular}
                onClick={handleCloseNavMenu}
              >
                Popular
              </Button>
              <Button
                key="Trending"
                component={Link}
                to={linkRoutes.responsiveAppBar.trending}
                onClick={handleCloseNavMenu}
              >
                Trending
              </Button>
            </Box>
            <Box
              className="responsive-app-bar-container-search-button"
              data-testid="responsive-app-bar-container-search-button"
            >
              <Button
                variant="outlined"
                onClick={handleOpenModalSearch}
                color="secondary"
                sx={{ color: theme.palette.text.secondary }}
                startIcon={<SearchIcon color="secondary" />}
              >
                Search...
              </Button>
              <IconButton
                onClick={handleOpenModalSearch}
                size="medium"
                aria-label="search"
                color="inherit"
              >
                <SearchIcon />
              </IconButton>
            </Box>
            <Box
              className="responsive-app-bar-container-genre-button"
              data-testid="responsive-app-bar-container-genre-button"
            >

              <Button
                key="Genre"
                onClick={handleOpenModalGenre}
              >
                Genre
              </Button>
            </Box>
            <Box
              className="responsive-app-bar-container-settings-menu"
              data-testid="responsive-app-bar-container-settings-menu"
            >
              <Tooltip title="Open settings">
                <IconButton
                  onClick={handleOpenUserMenu}
                >
                  <Avatar src={appResourcesPath.userDefaultIcon} />
                </IconButton>
              </Tooltip>
              {user?.id ? (
                <Menu
                  className="responsive-app-bar-settings-menu"
                  id="menu-setting"
                  data-testid="menu-setting"
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
                  <MenuItem component={Link} key="Profile" onClick={handleCloseUserMenu} to={linkRoutes.responsiveAppBar.profile(user.id)}>
                    Profile
                  </MenuItem>
                  <MenuItem component={Link} key="Account" onClick={handleCloseUserMenu} to={linkRoutes.responsiveAppBar.account}>
                    Account
                  </MenuItem>
                  <MenuItem component={Link} key="Dashboard" onClick={handleCloseUserMenu} to={linkRoutes.responsiveAppBar.dashboard}>
                    Dashboard
                  </MenuItem>
                  <MenuItem key="Logout" onClick={handleLogOut}>
                    Logout
                  </MenuItem>
                </Menu>
              ) : (
                <Menu
                  className="responsive-app-bar-settings-menu"
                  id="menu-setting"
                  data-testid="menu-setting"
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
                  <MenuItem component={Link} to={linkRoutes.responsiveAppBar.registration} key="Registration">
                    Registration
                  </MenuItem>
                </Menu>
              ) }

            </Box>
          </Toolbar>
          <ModalNotification title="See you soon" body="Successfully logged out" handleClose={handleCloseModalLogOut} open={modalLogOut} />
          <ModalGenre
            handleClose={handleCloseModalGenre}
            open={modalGenre}
            handleConfirm={handleConfirmModalGenre}
            genres={genres}
            handleChange={handleChangeGenre}
          />
          <ModalSearch
            handleClose={handleCloseModalSearch}
            open={modalSearch}
          />
          <Collapse in={openAlert}>
            <Alert
              className="responsive-app-bar-alert"
              data-testid="responsive-app-bar-alert"
              variant="filled"
              severity="error"
              action={(
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpenAlert(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
          )}
            >
              Something Wrong
            </Alert>
          </Collapse>
        </Container>
      </AppBar>
      <BackToTop idReference="#responsive-app-bar" />
    </>
  );
}
export default ResponsiveAppBar;
