import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import { Button, createTheme, Popover, ThemeProvider } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { useState } from "react";
import setTranslation from "../../other/locales/setTranslation";
import { logOut } from "../../redux/signSlice";
import {
  confirmFriendRequest,
  rejectFriendRequest,
  searchUsers
} from "../../redux/usersSlice";
import { useAppDispatch, useAppSelector } from "../../typescript/hook";
import {
  IFilteredUser,
  IOtherTranslation,
  IStringAvatar
} from "../../typescript/interfaces/data.js";
import LanguageChanger from "./LanguageChanger";
import MobileMenu from "./MobileMenu";
import NavDrawer from "./NavDrawer";


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

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const authData = useAppSelector((state) => state.sign.userData);

  const [searchText, setSearchText] = useState<string>("");

  const isMenuOpen: boolean = Boolean(anchorEl);

  const handleProfileMenuOpen = (
    event: React.MouseEvent<HTMLElement>
  ): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = (): void => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = (): void => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const stringAvatar = (name: string): IStringAvatar => {
    return {
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  const menuId: string = "primary-search-account-menu";

  const dispatch = useAppDispatch();

  const router = useRouter();
  const t: IOtherTranslation = setTranslation(router.locale as string)

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
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
      <Link href="/profile" passHref>
        <MenuItem onClick={handleMenuClose}>
          {/* this is not page component so I can't get access to getStaticProps  */}
          {t.profile}
        </MenuItem>
      </Link>
      <Link href="/settings" passHref>
        <MenuItem onClick={handleMenuClose}>
        {t.account_settings}
        </MenuItem>
      </Link>
      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          handleMobileMenuClose();
          dispatch(logOut());
        }}
      >
        {t.log_out}
      </MenuItem>
    </Menu>
  );

  const mobileMenuId: string = "primary-search-account-menu-mobile";

  const theme = createTheme({
    palette: {
      primary: {
        main: "#4700D8", //#391463
      },
      secondary: {
        main: "#f57c00",
      },
      error: {
        main: "rgb(211, 47, 47)",
      },
    },
  });

  const [drawer, setDrawer] = useState<boolean>(false);

  const toggleDrawer = (e: boolean): void => {
    setDrawer(e);
  };

  const mw600px = useMediaQuery("(max-width:600px)");

  const isAuthed = useAppSelector((state) => state.sign.isAuthed);

  const [anchorSearchEl, setAnchorSearchEl] = useState<null | HTMLElement>(
    null
  );
  const filteredUsers = useAppSelector((state) => state.users.filteredUsers);

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const lowerCase = e.target.value.toLowerCase();
    setSearchText(lowerCase);
    setAnchorSearchEl(e.currentTarget);
    dispatch(searchUsers({ searchText: lowerCase }));
  };

  const handleLose = (): void => {
    setAnchorSearchEl(null);
  };

  const open: boolean = Boolean(anchorSearchEl);
  const id: string | undefined = open ? "simple-popover" : undefined;

  const [anchorFriendsEl, setAnchorFriendsEl] = useState<null | HTMLElement>(
    null
  );

  const handleFriendsClick = (event: any): void => {
    setAnchorFriendsEl(event.currentTarget);
  };

  const handleFriendsClose = (): void => {
    setAnchorFriendsEl(null);
  };

  const notificationOpen: boolean = Boolean(anchorFriendsEl);
  const notificationId: string | undefined = notificationOpen
    ? "simple-friends-popover"
    : undefined;

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

            <Link href="/" passHref>
              <a>
                <Image
                  src={
                    "https://cat-talk-s3.s3.eu-central-1.amazonaws.com/2022-05-18T15-42-07.837Zcatlogo1.png"
                  }
                  alt={"catTalk"}
                  width="65px"
                  height="50px"
                  style={
                    mw600px
                      ? { margin: 2, cursor: "pointer", borderRadius: "50%" }
                      : { margin: 1, cursor: "pointer", borderRadius: "50%" }
                  }
                />
              </a>
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
            {filteredUsers.length !== 0 && (
              <Popover
                id={id}
                open={open}
                anchorEl={anchorSearchEl}
                onClose={handleLose}
                disableAutoFocus
                disableEnforceFocus
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                PaperProps={{
                  sx: {
                    backgroundColor: "#6226dd",
                    color: "#fff",
                  },
                }}
              >
                <Box sx={{ p: 2 }}>
                  {filteredUsers.map((item: IFilteredUser) => (
                    <Link href={`/profile/${item.id}`} passHref key={item.id}>
                      <a target="_blank" rel="noopener noreferrer">
                        <div
                          style={{
                            fontFamily: "Quicksand",
                            fontWeight: 800,
                            display: "flex",
                            columnGap: "20px",
                            alignItems: "center",
                            marginTop: "20px",
                            cursor: "pointer",
                          }}
                        >
                          {" "}
                          <div>
                            {item.avatar ? (
                              <Image
                                width="55px"
                                height="55px"
                                style={{ borderRadius: "50%" }}
                                src={item.avatar}
                                alt="content__img"
                              />
                            ) : (
                              <Avatar
                                {...stringAvatar(
                                  item.name + " " + item.surname
                                )}
                                sx={{
                                  bgcolor: "#fff",
                                  width: "55px",
                                  height: "55px",
                                  fontSize: "20px",
                                  color: "#000000",
                                }}
                              />
                            )}
                          </div>{" "}
                          <div>{item.username}</div>
                        </div>
                      </a>
                    </Link>
                  ))}
                </Box>
              </Popover>
            )}

            <Box sx={{ flexGrow: 1 }} />

            {isAuthed ? (
              <>
                <Box
                  sx={{
                    display: { xs: "none", md: "flex" },
                    columnGap: "15px",
                  }}
                >
                  <IconButton size="large" color="inherit">
                    <Badge
                      badgeContent={authData.friends.waitingFriends?.length}
                      color="error"
                    >
                      <NotificationsIcon
                        onClick={(e) => {
                          handleFriendsClick(e);
                        }}
                      />
                    </Badge>

                    <Popover
                      id={notificationId}
                      open={notificationOpen}
                      anchorEl={anchorFriendsEl}
                      onClose={handleFriendsClose}
                      disableAutoFocus
                      disableEnforceFocus
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      PaperProps={{
                        sx: {
                          backgroundColor: "#333C83",
                          color: "#fff",
                        },
                      }}
                      sx={{ marginLeft: "-20px" }}
                    >
                      {authData.friends.waitingFriends?.length !== 0 ? (
                        <Box sx={{ p: 2 }}>
                          {authData.friends.waitingFriends?.map(
                            (item: IFilteredUser) => (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: "15px",
                                }}
                                key={item.id}
                              >
                                <div>
                                  <Link href={`/profile/${item.id}`} passHref>
                                    <a
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <div
                                        style={{
                                          fontFamily: "Quicksand",
                                          fontWeight: 800,
                                          display: "flex",
                                          columnGap: "20px",
                                          alignItems: "center",
                                          marginTop: "20px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        {" "}
                                        <div>
                                          {item.avatar ? (
                                            <Image
                                              width="55px"
                                              height="55px"
                                              style={{ borderRadius: "50%" }}
                                              src={item.avatar}
                                              alt="content__img"
                                            />
                                          ) : (
                                            <Avatar
                                              {...stringAvatar(
                                                item.name + " " + item.surname
                                              )}
                                              sx={{
                                                bgcolor: "#fff",
                                                width: "65px",
                                                height: "65px",
                                                fontSize: "20px",
                                                color: "#000000",
                                              }}
                                            />
                                          )}
                                        </div>{" "}
                                        <div style={{ fontSize: "17px" }}>
                                          {item.username}
                                        </div>
                                      </div>
                                    </a>
                                  </Link>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    columnGap: "25px",
                                  }}
                                >
                                  <Button
                                    color="success"
                                    variant="contained"
                                    sx={{
                                      backgroundColor: "#4E9F3D",
                                      color: "#fff",
                                    }}
                                    onClick={() => {
                                      dispatch(
                                        confirmFriendRequest({
                                          id: item.id,
                                          name: item.name,
                                          surname: item.surname,
                                          username: item.username,
                                          avatar: item.avatar,
                                        })
                                      );
                                    }}
                                    disabled={authData.type === 'Guest'}
                                  >
                                    {t.confirm}
                                  </Button>
                                  <Button
                                    color="error"
                                    variant="contained"
                                    sx={{
                                      backgroundColor: "rgb(211, 47, 47)",
                                      color: "#fff",
                                    }}
                                    onClick={() => {
                                      dispatch(
                                        rejectFriendRequest({ id: item.id })
                                      );
                                    }}
                                  >
                                    {t.reject}
                                  </Button>
                                </div>
                              </div>
                            )
                          )}
                        </Box>
                      ) : (
                        <Box sx={{ p: 3, textAlign: "center" }}>
                          {t.friends_msg_1}
                          <br />
                          {t.friends_msg_2}
                          <br />
                          :(
                        </Box>
                      )}
                    </Popover>
                  </IconButton>

                  <IconButton size="large" color="inherit">
                    <Link href="/token" passHref>
                      <Badge badgeContent={0} color="error">
                        <MailIcon />
                      </Badge>
                    </Link>
                  </IconButton>

                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <LanguageChanger />
                </Box>
                <Box
                  sx={{
                    display: { xs: "flex", md: "none", columnGap: "20px" },
                  }}
                >
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
                  <LanguageChanger />
                </Box>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    display: { xs: "flex", md: "flex", columnGap: "30px" },
                  }}
                >
                  <Link href={"/signup"} passHref>
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
                  <LanguageChanger />
                </Box>
              </>
            )}
          </Toolbar>
        </AppBar>

        <MobileMenu
          mobileMoreAnchorEl={mobileMoreAnchorEl}
          setMobileMoreAnchorEl={setMobileMoreAnchorEl}
        />
        {isAuthed && renderMenu}
      </Box>
    </ThemeProvider>
  );
}
