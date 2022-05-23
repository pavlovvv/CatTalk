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
import { createTheme, ThemeProvider, Popover, Button } from "@mui/material";
import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import NavDrawer from "./NavDrawer";
import logo from "../../images/catlogo1.png";
import Avatar from "@mui/material/Avatar";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
import { logOut } from '../../redux/signSlice.js'
import { useSelector, useDispatch } from 'react-redux'
import Image from "next/image";
import { confirmFriendRequest, rejectFriendRequest, searchUsers } from "../../redux/usersSlice.js";

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
  const authData = useSelector(state => state.sign.userData)

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

  const stringAvatar = (name) => {
    return {
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  const menuId = "primary-search-account-menu";

  const dispatch = useDispatch()
  
  const [anchorFriendsMobileEl, setAnchorFriendsMobileEl] = useState(null);

  const handleFriendsMobileClick = (event) => {
    setAnchorFriendsMobileEl(event.currentTarget);
  };

  const handleFriendsMobileClose = () => {
    setAnchorFriendsMobileEl(null);
  };

  const notificationMobileOpen = Boolean(anchorFriendsMobileEl);
  const notificationMobileId = notificationMobileOpen ? 'simple-friends-popover-mobile' : undefined;

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
      PaperProps={{
        sx: {
          backgroundColor: "#333C83",
          color: "#fff",
        },
      }}
    >
      <Link href='/profile' passHref><MenuItem onClick={handleMenuClose}>Profile</MenuItem></Link>
      <Link href='/settings' passHref><MenuItem onClick={handleMenuClose}>Account settings</MenuItem></Link>
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
      PaperProps={{
        sx: {
          backgroundColor: "#333C83",
          color: "#fff",
        },
      }}
    >
      <Link href='/profile' passHref>
      <MenuItem>
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
      </Link>
      <Link href='/token' passHref>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={0} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      </Link>
      <MenuItem   onMouseEnter={handleFriendsMobileClick} 
          onMouseLeave={handleFriendsMobileClose}
            >
        <IconButton
          size="large"
          color="inherit"
        >
          <Badge badgeContent={authData.friends.waitingFriends?.length} color="error">
            <NotificationsIcon/>
          </Badge>
        </IconButton>
        <p>Friend requests</p>
        <Popover
                    id={notificationMobileId}
                    open={notificationMobileOpen}
                    anchorEl={anchorFriendsMobileEl}
                    onClose={handleFriendsMobileClose}
                    disableAutoFocus
                    disableEnforceFocus
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    PaperProps={{
                      sx: {
                        backgroundColor: "#333C83",
                        color: "#fff"
                      }
                    }}
                  >

                    {authData.friends.waitingFriends?.length !== 0 ? <Box sx={{ p: 2 }}>
                    {authData.friends.waitingFriends?.map((item) => (
                      <div style={{display:'flex', flexDirection: 'column', rowGap: '15px'}} key={item.id}>
                        <div>
                    <Link href={`/profile/${item.id}`} passHref>
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
                              width: "65px",
                              height: "65px",
                              fontSize: "20px",
                              color: '#000000'
                            }}
                          />
                        )}</div>  <div style={{fontSize: '17px'}}>{item.username}</div>
                        </div>
                      </a>
                    </Link>
                    </div>
                    <div style={{display:'flex', flexDirection: 'row', columnGap: '25px'}}>
                    <Button
                            color='success'
                            variant="contained"
                            sx={{ backgroundColor: '#4E9F3D', color: '#fff' }}
                            onClick={() => {
                              dispatch(confirmFriendRequest({id: item.id, name: item.name, surname: item.surname, 
                                username: item.username, avatar: item.avatar}))
                            }}
                          >
                            Confirm
                          </Button>
                          <Button
                              color='error'
                              variant="contained"
                              sx={{ backgroundColor: "rgb(211, 47, 47)", color: "#fff" }}
                              onClick={() => {
                                dispatch(rejectFriendRequest({id: item.id}))
                              }}
                            >
                              Reject
                            </Button>

                    </div>
                    </div>
                  ))}</Box> : <Box sx={{ p: 3, textAlign: 'center' }}>
                      We regret to inform you that<br />
                      nobody has sent you a friend request yet <br />
                      :(</Box>}

                  </Popover>
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
      error: {
        main: "rgb(211, 47, 47)"
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


  const [anchorSearchEl, setAnchorSearchEl] = useState(null);
  const filteredUsers = useSelector(state => state.users.filteredUsers)

  const searchHandler = (e) => {
    const lowerCase = e.target.value.toLowerCase();
    setSearchText(lowerCase);
    setAnchorSearchEl(e.currentTarget)
    dispatch(searchUsers({searchText: lowerCase}))
  };

  const handleLose = () => {
    setAnchorSearchEl(null)
  };

  const open = Boolean(anchorSearchEl);
  const id = open ? 'simple-popover' : undefined;


  const [anchorFriendsEl, setAnchorFriendsEl] = useState(null);

  const handleFriendsClick = (event) => {
    setAnchorFriendsEl(event.currentTarget);
  };

  const handleFriendsClose = () => {
    setAnchorFriendsEl(null);
  };

  const notificationOpen = Boolean(anchorFriendsEl);
  const notificationId = notificationOpen ? 'simple-friends-popover' : undefined;

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
              <Image
                src={'https://cat-talk-s3.s3.eu-central-1.amazonaws.com/2022-05-18T15-42-07.837Zcatlogo1.png'}
                alt={"catTalk"}
                width='65px'
                height='50px'
                style={mw600px
                  ? { margin: 2, cursor: 'pointer', borderRadius: '50%' }
                  : { margin: 1, cursor: 'pointer', borderRadius: '50%' }}
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
                anchorEl={anchorSearchEl}
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
              <Box sx={{ display: { xs: "none", md: "flex" }, columnGap:'15px' }}>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <Badge badgeContent={authData.friends.waitingFriends?.length} color="error">
                    <NotificationsIcon onClick={handleFriendsClick}/>
                  </Badge>

                  <Popover
                    id={notificationId}
                    open={notificationOpen}
                    anchorEl={anchorFriendsEl}
                    onClose={handleFriendsClose}
                    disableAutoFocus
                    disableEnforceFocus
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    PaperProps={{
                      sx: {
                        backgroundColor: "#333C83",
                        color: "#fff"
                      }
                    }}
                    sx={{marginLeft:'-20px'}}
                  >

                    {authData.friends.waitingFriends?.length !== 0 ? <Box sx={{ p: 2 }}>
                    {authData.friends.waitingFriends?.map((item) => (
                      <div style={{display:'flex', flexDirection: 'column', rowGap: '15px'}} key={item.id}>
                        <div>
                    <Link href={`/profile/${item.id}`} passHref>
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
                              width: "65px",
                              height: "65px",
                              fontSize: "20px",
                              color: '#000000'
                            }}
                          />
                        )}</div>  <div style={{fontSize: '17px'}}>{item.username}</div>
                        </div>
                      </a>
                    </Link>
                    </div>
                    <div style={{display:'flex', flexDirection: 'row', columnGap: '25px'}}>
                    <Button
                            color='success'
                            variant="contained"
                            sx={{ backgroundColor: '#4E9F3D', color: '#fff' }}
                            onClick={() => {
                              dispatch(confirmFriendRequest({id: item.id, name: item.name, surname: item.surname, 
                                username: item.username, avatar: item.avatar}))
                            }}
                          >
                            Confirm
                          </Button>
                          <Button
                              color='error'
                              variant="contained"
                              sx={{ backgroundColor: "rgb(211, 47, 47)", color: "#fff" }}
                              onClick={() => {
                                dispatch(rejectFriendRequest({id: item.id}))
                              }}
                            >
                              Reject
                            </Button>

                    </div>
                    </div>
                  ))}</Box> : <Box sx={{ p: 3, textAlign: 'center' }}>
                      We regret to inform you that<br />
                      nobody has sent you a friend request yet <br />
                      :(</Box>}

                  </Popover>
                </IconButton>

                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                >
                  <Link href='/token' passHref>
                  <Badge badgeContent={0} color="error">
                    <MailIcon />
                  </Badge>
                  </Link>
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
