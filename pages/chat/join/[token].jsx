import MainLayout from "../../../components/MainLayout.jsx";
import {
  TextField,
  Button,
  Avatar,
  Badge,
  createTheme,
  ThemeProvider,
  CircularProgress,
  Alert,
  Typography,
  useMediaQuery
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Send } from "@mui/icons-material";
import s from "../../../styles/chat.module.css";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { setChatPage, join, sendChatMessage, enterCharacter } from "../../../redux/chatSlice.js";
import { useRouter } from "next/router";
import { setDynamicPage } from "../../../redux/signSlice.js";
import { motion } from "framer-motion";
import { getConnectedUsers } from "../../../redux/tokenSlice.js";
import ReactMarkdown from 'react-markdown'



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

function Chat(props) {


  const dispatch = useDispatch()
  const router = useRouter()
  const authData = useSelector((state) => state.sign.userData)
  const connectedUsersCount = useSelector(state => state.token.connectedUsersCount)
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState("")
  const socket = useRef()
  const count = useRef()
  const authRef = useRef()
  const isLeft = useRef()
  const [connected, setConnected] = useState(false)
  const [isPending, setPending] = useState(false)
  const [error, setError] = useState(null)

  authRef.current = useSelector((state) => state.sign.userData)



  useEffect(() => {
    dispatch(setChatPage({ onChatPage: true }));
    dispatch(setDynamicPage({ isDynamicPage: true }))
    isLeft.current = false
    window.addEventListener('beforeunload', (evt) => {

      evt.preventDefault()

      const message = {
        event: "disconnection",
        username: authRef.current.info[2]?.username,
        userId: authRef.current.info[4]?.id,
        id: Date.now()
      };
      socket.current?.send(JSON.stringify(message));
      socket.current?.close();


      evt.returnValue = '';
      return null
    })

    return function disconnection() {

      // if (count.current > 1) {
      console.log('unmount disconnection')
      const message = {
        event: "disconnection",
        username: authRef.current.info[2]?.username,
        userId: authRef.current.info[4]?.id,
        id: Date.now()
      };
      socket.current?.send(JSON.stringify(message));
      socket.current?.close()

      dispatch(setChatPage({ onChatPage: false }));
      // }
      // count.current = 2
    }


  }, []);


  function connect() {
    const token = router.query.token
    isLeft.current = false


    socket.current = new WebSocket(`wss://${token}.glitch.me/`);

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: "connection",
        username: authData.info[2].username,
        userId: authData.info[4].id,
        id: Date.now(),
      };
      socket.current.send(JSON.stringify(message));
      dispatch(join({ token }))
    };
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.event === 'connection' || message.event === 'disconnection') {
        setTimeout(() => {
          dispatch(getConnectedUsers({ token }))
        }, 1000)
      }
      setMessages((prev) => [...prev, message]);
      router.push("#last");
    };
    socket.current.onclose = () => {
      if (!isLeft.current) {
        // dispatch(leave({token}))
        fetch('https://cattalkapi.herokuapp.com/chat/leave/', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: token
          }),
          keepalive: true // this is important!
        })
        isLeft.current = true
      }

      console.log('disconnected from socket')
      const message = {
        event: "own disconnection",
        id: Date.now(),
      };
      setMessages((prev) => [...prev, message]);
    };
    socket.current.onerror = () => {
      setError('Incorrect token')
      setPending(false)
    };
  }

  const sendMessage = async () => {
    const now = new Date();
    const minutes = 0;
    if (now.getMinutes() <= 9 ) {
       minutes = 0 + '' + now.getMinutes() 
    }
    else {
       minutes = now.getMinutes()
    }
    const message = {
      username: authData.info[2].username,
      name: authData.info[0].name,
      surname: authData.info[1].surname,
      avatar: authData.info[7].avatar ?? null,
      userId: authData.info[4].id,
      id: Date.now(),
      message: value,
      event: "message",
      date: now.getHours() + ":" + minutes,
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

      purple: {
        main: "#8479E1",
      },
    },
  });

  const mw999px = useMediaQuery("(max-width:999px)");
  const mw499px = useMediaQuery("(max-width:499px)");
  const mw369px = useMediaQuery("(max-width:369px)");

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
                      connect()
                      setPending(true)
                    }}
                    disabled={isPending}
                  >
                    {isPending ? <CircularProgress size={30} sx={{ color: "#fff" }} /> : 'JOIN'}
                  </Button>
                  {error && (
                    <Alert
                      severity="error"
                      color="primary"
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
                      color="primary"
                      variant="filled"
                      sx={{
                        backgroundColor: "rgb(245, 124, 0)",
                        color: "#fff",
                      }}
                    >
                      Please, wait. This may take up to 1 minute
                    </Alert>
                  )}
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
      dispatch(sendChatMessage())
      sendMessage();
    }
  };

  return (
    <MainLayout>
      <ThemeProvider theme={theme}>
      <div className={s.chatPage}>
        <section className={s.chatHeader}>
          <Button
            variant="contained"
            color="error"
            startIcon={<Logout />}
            sx={mw369px ? { width: '80%', margin: '20px' } : { width: '150px', margin: '20px' }}
            onClick={() => {
              router.push('/token')
            }}
          >
            Leave
          </Button>
          <Typography variant='overline' sx={{ color: '#fff', fontSize: '15px' }}>
            Connected users: {connectedUsersCount}
          </Typography>
        </section>
        <section className={s.chat}>
          <div className={s.messages + " " + s.chat__messages}>
            {messages.map((msg, idx) => {
              const boldCount = 1;
            
              const boldReplaced = msg.message?.replaceAll('**', e => {
                if (count % 2 !== 0) {
                  boldCount++
                  return "<b>"
                }

                else {
                  boldCount++
                  return "</b>"
                }

              });

              const boldFormattedText = msg.message?.split('*')
              
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
                                A user &quot;
                                <Link href={`/profile/${msg.userId}`} passHref>
                                  <a target="_blank" rel="noopener noreferrer">
                                    <span className={s.messages__connectionUsername}>
                                      {msg.username}
                                    </span>
                                  </a>
                                </Link>
                                &quot; has left
                              </div>
                            </div>
                          )}
                          {msg.event === "own disconnection" && (
                            <div className={s.messages__connection}>
                              <div className={s.connectionContainer}>
                                You have been disconnected
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
                                      <ReactMarkdown>{msg.message}</ReactMarkdown>
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
                                    <ReactMarkdown>{msg.message}</ReactMarkdown>
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
                            A user &quot;
                            <Link href={`/profile/${msg.userId}`} passHref>
                              <a target="_blank" rel="noopener noreferrer">
                                <span className={s.messages__connectionUsername}>
                                  {msg.username}
                                </span>
                              </a>
                            </Link>
                            &quot; has left
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
                                <ReactMarkdown>{msg.message}</ReactMarkdown>
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
                                <ReactMarkdown>{msg.message}</ReactMarkdown>
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

            <div id='down'></div>

        <section className={s.bottom}>
          <form onSubmit={onSubmit} className={s.bottom} >
          <Button
                variant="contained"
                color='purple'
                sx={{borderRadius: 0}}
              >
                <AttachFileIcon sx={{color: '#fff'}}/>
              </Button>

            <TextField
              id="outlined-basic"
              placeholder="Write"
              variant="outlined"
              sx={{ width: "100%", bgcolor: "#fff", borderRadius: '0px' }}
              value={value}
              multiline
              maxRows={3}
              fullWidth
              onFocus={() => {
                if (mw999px) {
                  router.push('#down')
                }
              }}
              onChange={(e) => {
                  setValue(e.target.value)
                  dispatch(enterCharacter())
              }}
              onKeyDown={e => {
                if(e.keyCode === 13 && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                  dispatch(sendChatMessage())
                  setValue("")
                }
              }
            }
            />

            <Link href="#last" passHref>
              <Button
                variant="contained"
                color='purple'
                sx={{borderRadius: 0}}
                onClick={(e) => {
                  if (value.replace(/\s+/g, "") !== "") {
                    sendMessage();
                    dispatch(sendChatMessage())
                  }
                }}
              >
                <Send sx={{color: '#fff'}}/>
              </Button>
            </Link>
          </form>
        </section>
      </div>
      </ThemeProvider>
    </MainLayout>
  );
}


function Chat2(props) {

  const isAuthed = useSelector((state) => state.sign.isAuthed);
  const isAuthFulfilled = useSelector(state => state.sign.isAuthFulfilled)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthed && isAuthFulfilled) {

      router.push('/signup')

    }
  }, [isAuthFulfilled])

  return <Chat {...props} />
}

export default function InitialChat(props) {

  const key = useSelector(state => state.sign.uniKey)

  return <Chat2 {...props} key={key} />
}