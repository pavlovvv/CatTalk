import React from "react";
import style from "./NavDrawer.module.css";
import logo from "../../images/catlogo1.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupIcon from "@mui/icons-material/Group";
import LoginIcon from "@mui/icons-material/Login";
import { Stack } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import SettingsIcon from "@mui/icons-material/Settings";
import withDefaultHOC from "../HOC/withDefaultHOC";
import Button from "@mui/material/Button";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { makeStyles } from "@mui/styles";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import LogoutIcon from '@mui/icons-material/Logout';
import { logOut } from "../../redux/signSlice";
import { Avatar } from "@mui/material";

const useStyles = makeStyles({
  tr: {
    transition: 'all 0.5s ease',
    "&:hover": {

      transform: 'rotateZ(20deg)'
  },
}});


export default function NavDrawer(props) {
  const classes = useStyles();

  const navItems = ["Profile", "Messages", "Users", "News", "Settings"];
  const linkItems = ["/profile", "/token", "/profile", "/profile", "/profile"];

  const Icons = [
    AccountCircleIcon,
    MessageIcon,
    GroupIcon,
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

  const isAuthed = useSelector(state => state.sign.isAuthed) 

  const dispatch = useDispatch()

  return (
    <ThemeProvider theme={theme}>
      <div>
        <CloseIcon
          fontSize="large"
          sx={{ float: "left", cursor: "pointer" }}
          onClick={() => props.setDrawer(false)}
          // className={style.close}
          className={classes.tr}
        />
        <div className={style.container}>
          <section className={style.header}>
            <h1 className={style.header__title}>CatTalk</h1>
            <Avatar src={logo.src} alt="CatTalk" className={style.header__logo}
            sx={{width: '72px', height: '58px'}} 
            //  width='72px' height='58px' 
            />
          </section>
        </div>
        <hr className={style.hr} />
        <div className={style.container}>
          <section className={style.auth}>
    {!isAuthed ? <Stack direction="row" spacing={2}>
              <Link href={'/login'} passHref>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<LoginIcon />}
              >
                Log in
              </Button>
              </Link>
              <Link href={'/signup'} passHref>
                 <Button variant="contained" color="success">
                    Sign up
                 </Button>
              </Link>
            </Stack>
            : 
              <Button
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                sx={{width: '100%'}}
                onClick={() => {
                  dispatch(logOut())
                }}
              >
                Log out
              </Button>

              
            }
            
          </section>
        </div>
        <div className={style.container}>
          <section className={style.navigation}>
            <nav>
              <ul>
                {navItems.map((item, i) => {
                  let Icon = withDefaultHOC(Icons[i]);
                  return (
                    <Link href={linkItems[i]} key={i} passHref>
                    <li className={style.navigation__item} style={{cursor: 'pointer'}}>
                      <Icon />
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
