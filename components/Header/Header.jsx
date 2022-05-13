import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { createTheme, ThemeProvider, Popover } from "@mui/material";
import { useState, useRef } from "react";
import Drawer from "@mui/material/Drawer";
import NavDrawer from "./NavDrawer";
import logo from "../../images/catlogo1.png";
import Avatar from "@mui/material/Avatar";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
import { logOut } from '../../redux/signSlice.js'
import { useSelector, useDispatch } from 'react-redux'
import Image from "next/image";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function PrimarySearchAppBar() {
 

 
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const [searchText, setSearchText] = useState("");


  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";

  const dispatch = useDispatch()
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link href='/profile' passHref><MenuItem onClick={handleMenuClose}>Profile</MenuItem></Link>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={() => {
        setAnchorEl(null);
        handleMobileMenuClose();
        dispatch(logOut())
      }}>Log out</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={0} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={0} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const theme = createTheme({
    palette: {
      primary: {
        main: "#4700D8", //#391463
      },
      secondary: {
        main: "#f57c00",
      },
      components: {
        MuiDrawer: {
          styleOverrides: {
            paper: {
              background: "orange",
            },
          },
        },
      },
    },
  });

  const [drawer, setDrawer] = useState(false);

  const toggleDrawer = (e) => {
    setDrawer(e);
  };

  const mw600px = useMediaQuery("(max-width:600px)");

  const isAuthed = useSelector(state => state.sign.isAuthed)
  const allUsers = useSelector(state => state.sign.allUsers)


  const [anchor2El, setAnchor2El] = useState(null);


  const searchHandler = (e) => {
    const lowerCase = e.target.value.toLowerCase();
    setSearchText(lowerCase);
    setAnchor2El(e.currentTarget)
  };

  const handleLose = () => {
    setAnchor2El(null)
  };

  const open = Boolean(anchor2El);
  const id = open ? 'simple-popover' : undefined;

  let filteredUsers = allUsers.filter((el) => {
    if (searchText === '') {
      return;
    }

    else {

      if (searchText.length > 2) {
        return el.data.toLowerCase().includes(searchText)
      }
    }
  })

  const stringAvatar = (name) => {
    return {
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <Toolbar>
            <IconButton
              onClick={() => {
                toggleDrawer(true);
              }}
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Drawer
              PaperProps={{
                sx: {
                  backgroundColor: "#333C83",
                  color: "#fff",
                },
              }}
              anchor={"left"}
              open={drawer}
              onClose={() => toggleDrawer(false)}
            >
              <NavDrawer setDrawer={setDrawer} />
            </Drawer>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { sm: "block" },
                lineHeight: 3,
                fontFamily: "Quicksand",
              }}
            >
              CatTalk
            </Typography>

            <Link href='/' passHref>
              <Avatar
                src={logo.src}
                alt={"catTalk"}
                sx={
                  mw600px
                    ? { width: 50, height: 50, marginLeft: 2, cursor: 'pointer' }
                    : { width: 50, height: 50, marginLeft: 1, cursor: 'pointer' }
                }

              />
            </Link>

            {!mw600px && (

              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search..."
                  inputProps={{ "aria-label": "Search" }}
                  onChange={searchHandler}
                  value={searchText}
                />
              </Search>


            )}
            {filteredUsers.length !== 0 &&
              <Popover
                id={id}
                open={open}
                anchorEl={anchor2El}
                onClose={handleLose}
                disableAutoFocus
                disableEnforceFocus
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                PaperProps={{
                  sx: {
                    backgroundColor: "#6226dd",
                    color: "#fff"
                  }
                }}
              >

                <Box sx={{ p: 2 }}>
                  {filteredUsers.map((item) => (
                    <Link href={`/profile/${item.id}`} passHref key={item.id}> 
                      <a target="_blank" rel="noopener noreferrer">
                        <div style={{
                          fontFamily: 'Quicksand', fontWeight: 800, display: 'flex', columnGap: '20px',
                          alignItems: 'center', marginTop: '20px', cursor: 'pointer'
                        }}> <div>{item.avatar ? (
                          <Image
                            width="55px"
                            height="55px"
                            style={{ borderRadius: '50%' }}
                            src={item.avatar}
                            alt="content__img"
                          />
                        ) : (
                          <Avatar
                            {...stringAvatar(
                              item.name +
                              " " +
                              item.surname
                            )}
                            sx={{
                              bgcolor: "#fff",
                              width: "55px",
                              height: "55px",
                              fontSize: "20px",
                              color: '#000000'
                            }}
                          />
                        )}</div>  <div>{item.username}</div>
                        </div>
                      </a>
                    </Link>
                  ))}</Box>
              </Popover>}

            {/* {filteredUsers.map((item) => (
              <li key={item.id}>{item.username}</li>
            ))} */}

            <Box sx={{ flexGrow: 1 }} />

            {isAuthed ? <>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                >
                  <Badge badgeContent={0} color="error">
                    <MailIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <Badge badgeContent={0} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </Box>
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </Box>
            </>
              : <>
                <Box sx={{ display: { xs: "flex", md: "flex" } }}>
                  <Link href={'/signup'} passHref>
                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="account of current user"
                      aria-controls={menuId}
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                  </Link>
                </Box>
              </>}


          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {isAuthed && renderMenu}
      </Box>
    </ThemeProvider>
  );
}
