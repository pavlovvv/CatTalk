import MainLayout from "../components/MainLayout.jsx";
import {
  TextField,
  Button,
  Avatar,
  Badge,
  createTheme,
  ThemeProvider,
  CircularProgress
} from "@mui/material";
import s from "../styles/chat.module.css";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { setChatPage } from "../redux/chatSlice.js";
import { useRouter } from "next/router";
import useMediaQuery from "@mui/material/useMediaQuery";
import { motion } from "framer-motion";

const StyledBadge = styled(Badge)(({ theme }) => ({
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

export default function Chat() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authData = useSelector((state) => state.sign.userData);
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const socket = useRef();
  const [connected, setConnected] = useState(false);
  const [isPending, setPending] = useState(false)


  let count = 1


  useEffect(() => {
    dispatch(setChatPage());


    return function disconnection() {
      if (count > 1) {
        const message = {
          event: "disconnection",
          id: Date.now(),
        };
        socket.current.send(JSON.stringify(message));
        socket.current?.close()
      }
      count++
    }


  }, []);



  function connect() {
    socket.current = new WebSocket("wss://ringed-tan-tithonia.glitch.me/");

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: "connection",
        username: authData.info[2].username,
        userId: authData.info[4].id,
        id: Date.now(),
      };
      socket.current.send(JSON.stringify(message));

    };
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
      router.push("#last");
    };
    socket.current.onclose = () => {
      // const message = {
      //   event: "disconnection",
      //   username: authData.info[2].username,
      //   userId: authData.info[4].id,
      //   id: Date.now(),
      // };
      // socket.current.send(JSON.stringify(message));
      console.log('disconnected')
    };
    socket.current.onerror = () => {
      console.log("Socket произошла ошибка");
    };
  }

  const sendMessage = async () => {
    const now = new Date();
    const message = {
      username: authData.info[2].username,
      name: authData.info[0].name,
      surname: authData.info[1].surname,
      avatar: authData.info[7].avatar ?? null,
      userId: authData.info[4].id,
      id: Date.now(),
      message: value,
      event: "message",
      date: now.getHours() + ":" + now.getMinutes(),
    };

    socket.current.send(JSON.stringify(message));
    setValue("");
  };

  const stringAvatar = (name) => {
    return {
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  const theme = createTheme({
    palette: {
      secondary: {
        main: "#4B7BE5",
      },
    },
  });

  const mw499px = useMediaQuery("(max-width:499px)");

  const moveTop = {
    visible: {
      y: 0,
      opacity: 1,
    },

    hidden: {
      y: 100,
      opacity: 0,
    },
  };

  if (!connected) {
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
                          className={s.entrancePanel__avatar}
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
                      connect()
                      setPending(true)
                    }}
                    disabled={isPending}
                  >
                    {isPending ? <CircularProgress size={30} sx={{ color: "#000000" }} /> : 'JOIN'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </MainLayout>
    );
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (value.replace(/\s+/g, "") !== "") {
      sendMessage();
    }
  };


  return (
    <MainLayout>
      <div className={s.chatPage}>
        <section className={s.chat}>
          <div className={s.messages + " " + s.chat__messages}>
            {messages.map((msg, idx) => {

              return (
                <div key={msg.id}>
                  {idx === messages.length - 1 ?
                    (
                      <div id='last'>
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          variants={moveTop}
                          viewport={{ amount: 0.9555 }}
                        >

                          {msg.event === "connection" && (
                            <div className={s.messages__connection}>
                              <div className={s.connectionContainer}>
                                A user &quot;
                                <Link href={`/profile/${msg.userId}`} passHref>
                                  <a target="_blank" rel="noopener noreferrer">
                                    <span className={s.messages__connectionUsername}>
                                      {msg.username}
                                    </span>
                                  </a>
                                </Link>
                                &quot; has joined
                              </div>
                            </div>
                          )}
                          {msg.event === "disconnection" && (
                            <div className={s.messages__connection}>
                              <div className={s.connectionContainer}>
                                Someone has left
                              </div>
                            </div>
                          )}
                          {msg.event === "message" && (
                            <div className={s.messages__message}>
                              {authData.info[2].username === msg.username ? (
                                <div
                                  className={
                                    s.messages__messageRight
                                  }
                                >
                                  <div className={s.messages__messageContainer + ' ' + s.messages__messageContainer_right}>
                                    <div className={s.messages__messageInfo}>
                                      <div className={s.messages__messageName}>
                                        <Link href={`/profile/${msg.userId}`} passHref>
                                          <a target="_blank" rel="noopener noreferrer">
                                            {msg.username}
                                          </a>
                                        </Link>
                                      </div>
                                      <div className={s.messages__messageTime}>
                                        {msg.date}
                                      </div>
                                    </div>

                                    <div className={s.messages__messageText}>
                                      {msg.message}
                                    </div>
                                  </div>
                                  <Link href={`/profile/${msg.userId}`} passHref>
                                    <a target="_blank" rel="noopener noreferrer">
                                      {msg.avatar ? (
                                        <Image
                                          width="70px"
                                          height="70px"
                                          className={s.userAvatar}
                                          src={authData.info[7].avatar}
                                          alt="content__img"
                                        />
                                      ) : (
                                        <Avatar
                                          {...stringAvatar(
                                            authData.info[0].name +
                                            " " +
                                            authData.info[1].surname
                                          )}
                                          sx={mw499px ? {
                                            bgcolor: "#2A2550",
                                            width: "60px",
                                            height: "60px",
                                            fontSize: "20px",
                                          } : {
                                            bgcolor: "#2A2550",
                                            width: "70px",
                                            height: "70px",
                                            fontSize: "20px",
                                          }}
                                        />
                                      )}
                                    </a>
                                  </Link>

                                </div>
                              ) : (
                                <div
                                  className={
                                    s.messages__messageLeft
                                  }
                                >
                                  <Link href={`/profile/${msg.userId}`} passHref>
                                    <a target="_blank" rel="noopener noreferrer">
                                      <StyledBadge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                        variant="dot"
                                      >
                                        {msg.avatar ? (
                                          <Image
                                            width="70px"
                                            height="70px"
                                            className={s.userAvatar}
                                            src={msg.avatar}
                                            alt="content__img"
                                          />
                                        ) : (
                                          <Avatar
                                            {...stringAvatar(
                                              msg.name +
                                              " " +
                                              msg.surname
                                            )}
                                            sx={mw499px ? {
                                              bgcolor: "#2A2550",
                                              width: "60px",
                                              height: "60px",
                                              fontSize: "20px",
                                            } : {
                                              bgcolor: "#2A2550",
                                              width: "70px",
                                              height: "70px",
                                              fontSize: "20px",
                                            }}
                                          />
                                        )}
                                      </StyledBadge>
                                    </a>
                                  </Link>

                                  <div className={s.messages__messageContainer + ' ' + s.messages__messageContainer_left}>
                                    <div className={s.messages__messageInfo}>
                                      <div className={s.messages__messageName}>
                                        <Link href={`/profile/${msg.userId}`} passHref>
                                          <a target="_blank" rel="noopener noreferrer">
                                            {msg.username}
                                          </a>
                                        </Link>
                                      </div>
                                      <div className={s.messages__messageTime}>
                                        {msg.date}
                                      </div>
                                    </div>

                                    <div className={s.messages__messageText}>
                                      {msg.message}
                                    </div>
                                  </div>

                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      </div>)
                    : (<div>
                      {msg.event === "connection" && (
                        <div className={s.messages__connection}>
                          <div className={s.connectionContainer}>
                            A user &quot;
                            <Link href={`/profile/${msg.userId}`} passHref>
                              <a target="_blank" rel="noopener noreferrer">
                                <span className={s.messages__connectionUsername}>
                                  {msg.username}
                                </span>
                              </a>
                            </Link>
                            &quot; has joined
                          </div>
                        </div>
                      )}
                      {msg.event === "disconnection" && (
                        <div className={s.messages__connection}>
                          <div className={s.connectionContainer}>
                            Someone has left
                          </div>
                        </div>
                      )}
                      {msg.event === "message" && (
                        <div className={s.messages__message}>
                          {authData.info[2].username === msg.username ? (
                            <div
                              className={
                                s.messages__messageRight
                              }
                            >
                              <div className={s.messages__messageContainer + ' ' + s.messages__messageContainer_right}>
                                <div className={s.messages__messageInfo}>
                                  <div className={s.messages__messageName}>
                                    <Link href={`/profile/${msg.userId}`} passHref>
                                      <a target="_blank" rel="noopener noreferrer">
                                        {msg.username}
                                      </a>
                                    </Link>
                                  </div>
                                  <div className={s.messages__messageTime}>
                                    {msg.date}
                                  </div>
                                </div>

                                <div className={s.messages__messageText}>
                                  {msg.message}
                                </div>
                              </div>
                              <Link href={`/profile/${msg.userId}`} passHref>
                                <a target="_blank" rel="noopener noreferrer">
                                  {msg.avatar ? (
                                    <Image
                                      width="70px"
                                      height="70px"
                                      className={s.userAvatar}
                                      src={authData.info[7].avatar}
                                      alt="content__img"
                                    />
                                  ) : (
                                    <Avatar
                                      {...stringAvatar(
                                        authData.info[0].name +
                                        " " +
                                        authData.info[1].surname
                                      )}
                                      sx={mw499px ? {
                                        bgcolor: "#2A2550",
                                        width: "60px",
                                        height: "60px",
                                        fontSize: "20px",
                                      } : {
                                        bgcolor: "#2A2550",
                                        width: "70px",
                                        height: "70px",
                                        fontSize: "20px",
                                      }}
                                    />
                                  )}
                                </a>
                              </Link>
                            </div>
                          ) : (
                            <div
                              className={
                                s.messages__messageLeft
                              }
                            >
                              <Link href={`/profile/${msg.userId}`} passHref>
                                <a target="_blank" rel="noopener noreferrer">
                                  <StyledBadge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                    variant="dot"
                                  >
                                    {msg.avatar ? (
                                      <Image
                                        width="70px"
                                        height="70px"
                                        className={s.userAvatar}
                                        src={msg.avatar}
                                        alt="content__img"
                                      />
                                    ) : (
                                      <Avatar
                                        {...stringAvatar(
                                          msg.name +
                                          " " +
                                          msg.surname
                                        )}
                                        sx={mw499px ? {
                                          bgcolor: "#2A2550",
                                          width: "60px",
                                          height: "60px",
                                          fontSize: "20px",
                                        } : {
                                          bgcolor: "#2A2550",
                                          width: "70px",
                                          height: "70px",
                                          fontSize: "20px",
                                        }}
                                      />
                                    )}
                                  </StyledBadge>
                                </a>
                              </Link>

                              <div className={s.messages__messageContainer + ' ' + s.messages__messageContainer_left}>
                                <div className={s.messages__messageInfo}>
                                  <div className={s.messages__messageName}>
                                    <Link href={`/profile/${msg.userId}`} passHref>
                                      <a target="_blank" rel="noopener noreferrer">
                                        {msg.username}
                                      </a>
                                    </Link>
                                  </div>
                                  <div className={s.messages__messageTime}>
                                    {msg.date}
                                  </div>
                                </div>

                                <div className={s.messages__messageText}>
                                  {msg.message}
                                </div>
                              </div>

                            </div>
                          )}
                        </div>
                      )}
                    </div>)}

                </div>
              );
            })}
          </div>
        </section>

        <section className={s.bottom}>
          <form onSubmit={onSubmit} className={s.bottom}>
            <TextField
              id="outlined-basic"
              placeholder="Write"
              variant="outlined"
              sx={{ width: "100%", bgcolor: "#fff" }}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

            <Link href="#last" passHref>
              <Button
                variant="contained"
                onClick={(e) => {
                  if (value.replace(/\s+/g, "") !== "") {
                    sendMessage();
                  }
                }}
              >
                Send
              </Button>
            </Link>
          </form>
        </section>
      </div>
    </MainLayout>
  );
}
