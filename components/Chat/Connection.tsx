import {
  Alert,
  Avatar,
  Badge,
  Button,
  CircularProgress,
  styled,
  ThemeProvider
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import setTranslation from "../../other/locales/setTranslation";
import { join } from "../../redux/chatSlice";
import { getConnectedUsers } from "../../redux/tokenSlice";
import s from "../../styles/chat.module.scss";
import { useAppDispatch, useAppSelector } from "../../typescript/hook";
import {
  IConnectionProps,
  ISocketOnMessage,
  IStringAvatar,
  IOtherTranslation
} from "../../typescript/interfaces/data";
import MainLayout from "../MainLayout";

const StyledBadge = styled(Badge)(({ theme }: any) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    width: "10px",
    height: "10px",
    borderRadius: "80%",
    boxShadow: `0 0 0 0px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Connection: React.FC<IConnectionProps> = ({
  theme,
  error,
  isPending,
  isLeft,
  socket,
  setMessages,
  setError,
  setPending,
  setConnected,
  connectedUsersInterval,
}) => {
  const router = useRouter();

  const t: IOtherTranslation = setTranslation(router.locale as string);

  const dispatch = useAppDispatch();

  const authData = useAppSelector((state) => state.sign.userData);

  const connect = (): void => {
    let token: string | string[] = "";
    if (router.query.token) {
      token = router.query.token;
    }
    isLeft.current = false;
    socket.current = new WebSocket(`wss://${token}.glitch.me/`);

    socket.current.onopen = (): void => {
      setConnected(true);
      const message = {
        event: "connection",
        username: authData.info[2].username,
        userId: authData.info[4].id,
        id: Date.now(),
      };
      socket.current.send(JSON.stringify(message));
      dispatch(join({ token }));
    };
    socket.current.onmessage = (event: ISocketOnMessage): void => {
      const message = JSON.parse(event.data);
      if (message.event === "connection" || message.event === "disconnection") {
        connectedUsersInterval.current = setInterval(() => {
          dispatch(getConnectedUsers({ token }));
        }, 1000);
      }
      setMessages((prev: object[]) => [...prev, message]);
      router.push("#last")
    };
    socket.current.onclose = (): void => {
      if (!isLeft.current) {
        fetch("https://cattalk-api.onrender.com/chat/leave/", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
          }),
          keepalive: true, // this is important!
        });

        isLeft.current = true;
      }

      console.log("disconnected from socket");
      const message = {
        event: "own disconnection",
        id: Date.now(),
      };
      setMessages((prev: object[]) => [...prev, message]);
    };
    socket.current.onerror = (): void => {
      setError("Incorrect token");
      setPending(false);
    };
  };

  const stringAvatar = (name: string): IStringAvatar => {
    return {
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  return (
    <MainLayout>
      <ThemeProvider theme={theme}>
        <div className={s.entrancePage}>
          <div className={s.entrancePanel}>
            <div className={s.container}>
              <div className={s.entrancePanel__inner}>
                <div className={s.entrancePanel__top}>
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    {authData.info[7]?.avatar ? (
                      <Image
                        width="80px"
                        height="80px"
                        className={s.userAvatar}
                        src={authData.info[7].avatar}
                        alt="content__img"
                      />
                    ) : (
                      <Avatar
                        {...stringAvatar(
                          authData.info[0]?.name +
                            " " +
                            authData.info[1]?.surname
                        )}
                        sx={{
                          bgcolor: "#2A2550",
                          width: "80px",
                          height: "80px",
                          fontSize: "25px",
                        }}
                      />
                    )}
                  </StyledBadge>
                  <span className={s.entrancePanel__topUsername}>
                    {authData.info[2]?.username}
                  </span>
                </div>
                <Button
                  variant="contained"
                  sx={{ width: "100%", lineHeight: "25px" }}
                  color="secondary"
                  onClick={() => {
                    connect();
                    setPending(true);
                  }}
                  disabled={isPending}
                >
                  {isPending ? (
                    <CircularProgress size={30} sx={{ color: "#fff" }} />
                  ) : (
                    <>{t.join}</>
                  )}
                </Button>
                {error && (
                  <Alert
                    severity="error"
                    variant="filled"
                    sx={{
                      backgroundColor: "rgb(211, 47, 47)",
                      color: "#fff",
                    }}
                  >
                    {error}
                  </Alert>
                )}
                {isPending && (
                  <Alert
                    severity="warning"
                    variant="filled"
                    sx={{
                      backgroundColor: "rgb(245, 124, 0)",
                      color: "#fff",
                    }}
                  >
                    {t.wait}
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </MainLayout>
  );
};

export default Connection;
