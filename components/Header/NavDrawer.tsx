import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MessageIcon from "@mui/icons-material/Message";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import SettingsIcon from "@mui/icons-material/Settings";
import { createTheme, Stack, ThemeProvider } from "@mui/material";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { logOut } from "../../redux/signSlice";
import { useAppDispatch, useAppSelector } from "../../typescript/hook";
import style from "./NavDrawer.module.css";

const useStyles = makeStyles({
  tr: {
    transition: "all 0.5s ease",
    "&:hover": {
      transform: "rotateZ(20deg)",
    },
  },
});

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

interface INavDrawerProps {
  setDrawer: (isDrawer: boolean) => void;
}

export default function NavDrawer(props: INavDrawerProps) {
  const classes = useStyles();

  const navItems: string[] = [
    "Profile",
    "Messages",
    "Leaderboard",
    "News",
    "Settings",
  ];
  const linkItems: string[] = [
    "/profile",
    "/token",
    "/leaderboard",
    "/news",
    "/settings",
  ];

  const Icons: any[] = [
    AccountCircleIcon,
    MessageIcon,
    LeaderboardIcon,
    NewspaperIcon,
    SettingsIcon,
  ];

  const theme = createTheme({
    palette: {
      secondary: {
        main: "#85C88A",
      },
    },
  });

  const isAuthed = useAppSelector((state) => state.sign.isAuthed);

  const dispatch = useAppDispatch();

  return (
    <ThemeProvider theme={theme}>
      <div className={style.closeIcon}>
        <CloseIcon
          fontSize="large"
          sx={{ float: "right", cursor: "pointer" }}
          onClick={() => props.setDrawer(false)}
          // className={style.close}
          className={classes.tr}
        />
        <div className={style.container}>
          <section className={style.header}>
            <h1 className={style.header__title}>CatTalk</h1>
            {/* <Avatar src={logo.src} alt="CatTalk" className={style.header__logo}
            sx={{width: '72px', height: '58px'}} 
            //  width='72px' height='58px' 
            /> */}
            <Image
              src={
                "https://cat-talk-s3.s3.eu-central-1.amazonaws.com/2022-05-18T15-42-07.837Zcatlogo1.png"
              }
              alt={"CatTalk"}
              width="72px"
              height="58px"
              style={{ borderRadius: "50%" }}
            />
          </section>
        </div>
        <hr className={style.hr} />
        <div className={style.container}>
          <section className={style.auth}>
            {!isAuthed ? (
              <Stack direction="row" spacing={2}>
                <Link href={"/login"} passHref>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<LoginIcon />}
                    size="large"
                    sx={{ color: "#85C88A" }}
                  >
                    Log in
                  </Button>
                </Link>
                <Link href={"/signup"} passHref>
                  <Button variant="contained" color="success" size="large">
                    Sign up
                  </Button>
                </Link>
              </Stack>
            ) : (
              <Button
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                sx={{ width: "100%" }}
                onClick={() => {
                  dispatch(logOut());
                }}
                size="large"
              >
                Log out
              </Button>
            )}
          </section>
        </div>
        <div className={style.container}>
          <section className={style.navigation}>
            <nav>
              <ul>
                {navItems.map((item, i) => {
                  let Icon = Icons[i];
                  return (
                    <Link href={linkItems[i]} key={i} passHref>
                      <li
                        className={style.navigation__item}
                        style={{ cursor: "pointer" }}
                      >
                        <Icon sx={{ marginRight: "8px" }} />
                        &nbsp; {item}
                      </li>
                    </Link>
                  );
                })}
              </ul>
            </nav>
          </section>
        </div>
      </div>
    </ThemeProvider>
  );
}
