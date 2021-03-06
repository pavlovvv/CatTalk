import React from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Button, Popover } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import Link from "next/link";
import {
  confirmFriendRequest,
  rejectFriendRequest,
} from "../../redux/usersSlice";
import { useAppDispatch, useAppSelector } from "../../typescript/hook";
import { useState } from "react";
import {
  IStringAvatar,
  IMobileMenuProps,
  IOtherTranslation,
  IWaitingFriendsItem
} from "../../typescript/interfaces/data.js";
import { useRouter } from "next/router";
import setTranslation from "../../other/locales/setTranslation";


const MobileMenu: React.FC<IMobileMenuProps> = (props) => {
  const dispatch = useAppDispatch();

  const authData = useAppSelector((state) => state.sign.userData);

  const isMobileMenuOpen: boolean = Boolean(props.mobileMoreAnchorEl);

  const handleMobileMenuClose = (): void => {
    props.setMobileMoreAnchorEl(null);
  };

  const mobileMenuId: string = "primary-search-account-menu-mobile";

  const [anchorFriendsMobileEl, setAnchorFriendsMobileEl] =
    useState<null | HTMLElement>(null);

  const handleFriendsMobileClick = (
    event: React.MouseEvent<HTMLElement>
  ): void => {
    setAnchorFriendsMobileEl(event.currentTarget);
  };

  const handleFriendsMobileClose = (): void => {
    setAnchorFriendsMobileEl(null);
  };

  const notificationMobileOpen: boolean = Boolean(anchorFriendsMobileEl);
  const notificationMobileId: string | undefined = notificationMobileOpen
    ? "simple-friends-popover-mobile"
    : undefined;

  const stringAvatar = (name: string): IStringAvatar => {
    return {
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  const router = useRouter();
  const t: IOtherTranslation = setTranslation(router.locale as string)

  return (
    <Menu
      anchorEl={props.mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
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
      <Link href="/profile" passHref>
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
          <p>
            {t.profile}
          </p>
        </MenuItem>
      </Link>
      <Link href="/token" passHref>
        <MenuItem>
          <IconButton size="large" color="inherit">
            <Badge badgeContent={0} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>
                                    {/* this is not page component so I can't get access to getStaticProps  */}
            {t.messages}
          </p>
        </MenuItem>
      </Link>
      <MenuItem
        onMouseEnter={handleFriendsMobileClick}
        onMouseLeave={handleFriendsMobileClose}
      >
        <IconButton size="large" color="inherit">
          <Badge
            badgeContent={authData.friends.waitingFriends?.length}
            color="error"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>
          {t.friend_requests}
        </p>
        <Popover
          id={notificationMobileId}
          open={notificationMobileOpen}
          anchorEl={anchorFriendsMobileEl}
          onClose={handleFriendsMobileClose}
          disableAutoFocus
          disableEnforceFocus
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          PaperProps={{
            sx: {
              backgroundColor: "#333C83",
              color: "#fff",
            },
          }}
        >
          {authData.friends.waitingFriends?.length !== 0 ? (
            <Box sx={{ p: 2 }}>
              {authData.friends.waitingFriends?.map(
                (item: IWaitingFriendsItem) => (
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
                        sx={{ backgroundColor: "#4E9F3D", color: "#fff" }}
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
                        {/* this is not page component so I can't get access to getStaticProps  */}
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
                          dispatch(rejectFriendRequest({ id: item.id }));
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
              {/* this is not page component so I can't get access to getStaticProps  */}
              {t.friends_msg_1}
              <br />
              {t.friends_msg_2}
              <br />
              :(
            </Box>
          )}
        </Popover>
      </MenuItem>
    </Menu>
  );
};

export default MobileMenu;
