import { Send } from "@mui/icons-material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Logout from "@mui/icons-material/Logout";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  createTheme,
  Fade,
  LinearProgress,
  Popover,
  Slide,
  Snackbar,
  styled,
  TextField,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { DragEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import Connection from "../../../components/Chat/Connection";
import MainLayout from "../../../components/MainLayout";
import {
  enterCharacter,
  sendChatMessage,
  setChatPage,
} from "../../../redux/chatSlice";
import { getOwnInfo, setDynamicPage } from "../../../redux/signSlice";
import s from "../../../styles/chat.module.scss";
import { useAppDispatch, useAppSelector } from "../../../typescript/hook";
import {
  IChatAuthRef,
  IChatMessage,
  IChatProgressProps,
  IChatSnackbar,
  IChatUploadedFile,
  ILocale,
  IStringAvatar,
} from "../../../typescript/interfaces/data";

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

const useStyles = makeStyles({
  purple: {
    backgroundColor: "#8479E1",
    "&:hover": {
      backgroundColor: "#9772FB",
    },
  },
});

const SlideTransition: React.FC<any> = (props) => {
  return <Slide {...props} direction="up" />;
};

const LinearProgressWithLabel = (props: IChatProgressProps) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#EBD671",
      },
      secondary: {
        main: "#fff",
      },
    },
  });

  const mw599px = useMediaQuery("(max-width:599px)");

  const CircularProgressWithLabel = (props: IChatProgressProps) => {
    return (
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress variant="determinate" color="secondary" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            component="div"
            sx={{ color: "#fff", padding: 1 }}
          >
            {props.value && <>{`${Math.round(props.value)}%`}</>}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ maxWidth: 55, marginRight: "10px" }}>
          <Typography
            variant="body2"
            sx={{
              color: "#fff",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {props.filename}
          </Typography>
        </Box>{" "}
        {!mw599px ? (
          <>
            <Box sx={{ width: "300px", mr: 1 }}>
              <LinearProgress
                variant="determinate"
                color="primary"
                {...props}
              />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              {props.value && (
                <Typography
                  variant="body2"
                  sx={{ color: "#fff" }}
                >{`${Math.round(props.value)}%`}</Typography>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ mr: 1 }}>
            <CircularProgressWithLabel value={props.value} />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

const Chat: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authData = useAppSelector((state) => state.sign.userData);
  const connectedUsersCount = useAppSelector(
    (state) => state.token.connectedUsersCount
  );
  const [messages, setMessages] = useState<object[]>([]);
  const [value, setValue] = useState<string>("");
  const socket = useRef<any>();
  const authRef = useRef<IChatAuthRef>();
  const isLeft = useRef<boolean>();
  const connectedUsersInterval = useRef<any>();
  const [connected, setConnected] = useState<boolean>(false);
  const [isPending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileUploadingProgress, setFileUploadingProgress] = useState<number>(0);
  const [snackbarState, setSnackbarState] = useState<IChatSnackbar>({
    snackbarOpen: false,
    Transition: Fade,
  });
  const [isLoadingOver, setLoadingOver] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drag, setDrag] = useState<boolean>(false);
  const [uploadingError, setUploadingError] = useState<boolean>(false);

  const { t } = useTranslation("chat");
  const ct = useTranslation("common").t;

  authRef.current = useAppSelector((state) => state.sign.userData);

  useEffect(() => {
    dispatch(setChatPage(true));
    dispatch(setDynamicPage(true));

    isLeft.current = false;
    window.addEventListener("beforeunload", (evt) => {
      evt.preventDefault();

      if (authRef.current) {
        const message = {
          event: "disconnection",
          username: authRef.current.info[2]?.username,
          userId: authRef.current.info[4]?.id,
          id: Date.now(),
        };

        socket.current?.send(JSON.stringify(message));
        socket.current?.close();
      }

      evt.returnValue = "";
      return null;
    });

    return function disconnection() {
      clearInterval(connectedUsersInterval.current);

      if (authRef.current) {
        const message = {
          event: "disconnection",
          username: authRef.current.info[2]?.username,
          userId: authRef.current.info[4]?.id,
          id: Date.now(),
        };
        socket.current?.send(JSON.stringify(message));
        socket.current?.close();
      }

      dispatch(setChatPage(false));
    };
  }, []);

  const sendMessage = async () => {
    const now = new Date();
    let minutes: number | string = 0;
    if (now.getMinutes() <= 9) {
      minutes = 0 + "" + now.getMinutes();
    } else {
      minutes = now.getMinutes();
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

  const stringAvatar = (name: string): IStringAvatar => {
    return {
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      secondary: {
        main: "#4B7BE5",
      },
    },
  });

  const classes = useStyles();

  const mw999px = useMediaQuery("(max-width:999px)");
  const mw499px = useMediaQuery("(max-width:499px)");
  const mw369px = useMediaQuery("(max-width:369px)");
  const mw599px = useMediaQuery("(max-width:599px)");

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
      <Connection
        theme={theme}
        error={error}
        isPending={isPending}
        isLeft={isLeft}
        socket={socket}
        setMessages={setMessages}
        setError={setError}
        setPending={setPending}
        setConnected={setConnected}
        connectedUsersInterval={connectedUsersInterval}
        //t={t}
      />
    );
  }

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (value.replace(/\s+/g, "") !== "") {
      dispatch(sendChatMessage());
      sendMessage();
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const open: boolean = Boolean(anchorEl);
  const id: string | undefined = open ? "simple-popover" : undefined;

  const uploadFile = (files: any): void => {
    const formData: any = new FormData();
    for (const file of Object.entries(files)) {
      formData.append("file", file[1]);
    }

    setFileName(files.length > 1 ? files.length + " files" : files[0].name);

    axios
      .post(`https://cattalk-api.onrender.com/chat/uploadFile`, formData, {
        withCredentials: true,
        onUploadProgress: (e) => {
          setUploadingError(false);

          setSnackbarState({
            snackbarOpen: true,
            Transition: SlideTransition,
          });

          setFileUploadingProgress(Math.round((e.loaded * 100) / e.total));
        },
      })
      .then((response) => {
        setTimeout(() => {
          setLoadingOver(true);
          response.data.forEach((file: IChatUploadedFile, i: number) => {
            setTimeout(() => {
              const now = new Date();
              let minutes: number | string = 0;
              if (now.getMinutes() <= 9) {
                minutes = 0 + "" + now.getMinutes();
              } else {
                minutes = now.getMinutes();
              }
              const message = {
                username: authData.info[2].username,
                name: authData.info[0].name,
                surname: authData.info[1].surname,
                avatar: authData.info[7].avatar ?? null,
                userId: authData.info[4].id,
                id: Date.now(),
                isFile: true,
                link: file.Location,
                message: file.Key.slice(24),
                event: "message",
                date: now.getHours() + ":" + minutes,
              };

              socket.current.send(JSON.stringify(message));
            }, i * 500);
          });
          dispatch(getOwnInfo());
        }, 500);

        setTimeout(() => {
          setSnackbarState({
            ...snackbarState,
            snackbarOpen: false,
          });
          setFileUploadingProgress(0);
          setLoadingOver(false);
        }, 4000);
      })
      .catch((err) => {
        setFileUploadingProgress(0);
        setUploadingError(true);
        setTimeout(() => {
          setUploadingError(false);
          setSnackbarState({
            ...snackbarState,
            snackbarOpen: false,
          });
        }, 4000);
      });
  };

  const hiddenFileUploadInput = () => {
    return (
      <input
        type="file"
        multiple
        onChange={(e) => {
          uploadFile(e.target.files);
        }}
        hidden
      />
    );
  };

  const dragStartHandler = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDrag(true);
  };

  const dragLeaveHandler = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDrag(false);
  };

  const onDropHandler = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    uploadFile(e.dataTransfer.files);
    setDrag(false);
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
              sx={
                mw369px
                  ? { width: "80%", margin: "20px" }
                  : { width: "150px", margin: "20px" }
              }
              onClick={() => {
                router.push("/token");
              }}
            >
              {t("leave")}
            </Button>
            <Typography
              variant="overline"
              sx={{ color: "#fff", fontSize: "15px" }}
            >
              {t("connected_users")} {connectedUsersCount}
            </Typography>
          </section>
          <section className={s.chat}>
            <div className={s.messages + " " + s.chat__messages}>
              {messages.map((msg: IChatMessage, idx: number) => {
                return (
                  <div key={!msg.isFile ? msg.id : idx}>
                    {idx === messages.length - 1 ? (
                      <div id="last">
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          variants={moveTop}
                        >
                          {msg.event === "connection" && (
                            <div className={s.messages__connection}>
                              <div className={s.connectionContainer}>
                                &quot;
                                <Link href={`/profile/${msg.userId}`} passHref>
                                  <a target="_blank" rel="noopener noreferrer">
                                    <span
                                      className={s.messages__connectionUsername}
                                    >
                                      {msg.username}
                                    </span>
                                  </a>
                                </Link>
                                &quot; {t("has_joined")}
                              </div>
                            </div>
                          )}
                          {msg.event === "disconnection" && (
                            <div className={s.messages__connection}>
                              <div className={s.connectionContainer}>
                                &quot;
                                <Link href={`/profile/${msg.userId}`} passHref>
                                  <a target="_blank" rel="noopener noreferrer">
                                    <span
                                      className={s.messages__connectionUsername}
                                    >
                                      {msg.username}
                                    </span>
                                  </a>
                                </Link>
                                &quot; {t("has_left")}
                              </div>
                            </div>
                          )}
                          {msg.event === "own disconnection" && (
                            <div className={s.messages__connection}>
                              <div className={s.connectionContainer}>
                                {t("disconnection1")} <br />
                                {t("disconnection2")}
                              </div>
                            </div>
                          )}
                          {msg.event === "message" && (
                            <div className={s.messages__message}>
                              {authData.info[2].username === msg.username ? (
                                <div className={s.messages__messageRight}>
                                  <div
                                    className={
                                      s.messages__messageContainer +
                                      " " +
                                      s.messages__messageContainer_right
                                    }
                                  >
                                    <div className={s.messages__messageInfo}>
                                      <div className={s.messages__messageName}>
                                        <Link
                                          href={`/profile/${msg.userId}`}
                                          passHref
                                        >
                                          <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {msg.username}
                                          </a>
                                        </Link>
                                      </div>
                                      <div className={s.messages__messageTime}>
                                        {msg.date}
                                      </div>
                                    </div>

                                    <div className={s.messages__messageText}>
                                      {!msg.isFile ? (
                                        <ReactMarkdown>
                                          {msg.message}
                                        </ReactMarkdown>
                                      ) : (
                                        <div
                                          className={s.messages__fileMessage}
                                        >
                                          <a
                                            href={msg.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ minWidth: "25px" }}
                                          >
                                            <InsertDriveFileIcon
                                              fontSize="large"
                                              sx={{ color: "#fff" }}
                                            />
                                          </a>
                                          <a
                                            href={msg.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {msg.message}
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <Link
                                    href={`/profile/${msg.userId}`}
                                    passHref
                                  >
                                    <a
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {msg.avatar ? (
                                        <div style={{ minWidth: "70px" }}>
                                          <Image
                                            width="70px"
                                            height="70px"
                                            className={s.userAvatar}
                                            src={authData.info[7].avatar}
                                            alt="content__img"
                                          />
                                        </div>
                                      ) : (
                                        <Avatar
                                          {...stringAvatar(
                                            authData.info[0].name +
                                              " " +
                                              authData.info[1].surname
                                          )}
                                          sx={
                                            mw499px
                                              ? {
                                                  bgcolor: "#2A2550",
                                                  width: "60px",
                                                  height: "60px",
                                                  fontSize: "20px",
                                                }
                                              : {
                                                  bgcolor: "#2A2550",
                                                  width: "70px",
                                                  height: "70px",
                                                  fontSize: "20px",
                                                }
                                          }
                                        />
                                      )}
                                    </a>
                                  </Link>
                                </div>
                              ) : (
                                <div className={s.messages__messageLeft}>
                                  <Link
                                    href={`/profile/${msg.userId}`}
                                    passHref
                                  >
                                    <a
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <StyledBadge
                                        overlap="circular"
                                        anchorOrigin={{
                                          vertical: "bottom",
                                          horizontal: "right",
                                        }}
                                        variant="dot"
                                      >
                                        {msg.avatar ? (
                                          <div style={{ minWidth: "70px" }}>
                                            <Image
                                              width="70px"
                                              height="70px"
                                              className={s.userAvatar}
                                              src={msg.avatar}
                                              alt="content__img"
                                            />
                                          </div>
                                        ) : (
                                          <Avatar
                                            {...stringAvatar(
                                              msg.name + " " + msg.surname
                                            )}
                                            sx={
                                              mw499px
                                                ? {
                                                    bgcolor: "#2A2550",
                                                    width: "60px",
                                                    height: "60px",
                                                    fontSize: "20px",
                                                  }
                                                : {
                                                    bgcolor: "#2A2550",
                                                    width: "70px",
                                                    height: "70px",
                                                    fontSize: "20px",
                                                  }
                                            }
                                          />
                                        )}
                                      </StyledBadge>
                                    </a>
                                  </Link>

                                  <div
                                    className={
                                      s.messages__messageContainer +
                                      " " +
                                      s.messages__messageContainer_left
                                    }
                                  >
                                    <div className={s.messages__messageInfo}>
                                      <div className={s.messages__messageName}>
                                        <Link
                                          href={`/profile/${msg.userId}`}
                                          passHref
                                        >
                                          <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {msg.username}
                                          </a>
                                        </Link>
                                      </div>
                                      <div className={s.messages__messageTime}>
                                        {msg.date}
                                      </div>
                                    </div>

                                    <div className={s.messages__messageText}>
                                      {!msg.isFile ? (
                                        <ReactMarkdown>
                                          {msg.message}
                                        </ReactMarkdown>
                                      ) : (
                                        <div
                                          className={s.messages__fileMessage}
                                        >
                                          <a
                                            href={msg.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {msg.message}
                                          </a>
                                          <a
                                            href={msg.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ minWidth: "25px" }}
                                          >
                                            <InsertDriveFileIcon
                                              fontSize="large"
                                              sx={{ color: "#fff" }}
                                            />
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      </div>
                    ) : (
                      <div>
                        {msg.event === "connection" && (
                          <div className={s.messages__connection}>
                            <div className={s.connectionContainer}>
                              &quot;
                              <Link href={`/profile/${msg.userId}`} passHref>
                                <a target="_blank" rel="noopener noreferrer">
                                  <span
                                    className={s.messages__connectionUsername}
                                  >
                                    {msg.username}
                                  </span>
                                </a>
                              </Link>
                              &quot; {t("has_joined")}
                            </div>
                          </div>
                        )}
                        {msg.event === "disconnection" && (
                          <div className={s.messages__connection}>
                            <div className={s.connectionContainer}>
                              &quot;
                              <Link href={`/profile/${msg.userId}`} passHref>
                                <a target="_blank" rel="noopener noreferrer">
                                  <span
                                    className={s.messages__connectionUsername}
                                  >
                                    {msg.username}
                                  </span>
                                </a>
                              </Link>
                              &quot; {t("has_left")}
                            </div>
                          </div>
                        )}
                        {msg.event === "message" && (
                          <div className={s.messages__message}>
                            {authData.info[2].username === msg.username ? (
                              <div className={s.messages__messageRight}>
                                <div
                                  className={
                                    s.messages__messageContainer +
                                    " " +
                                    s.messages__messageContainer_right
                                  }
                                >
                                  <div className={s.messages__messageInfo}>
                                    <div className={s.messages__messageName}>
                                      <Link
                                        href={`/profile/${msg.userId}`}
                                        passHref
                                      >
                                        <a
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {msg.username}
                                        </a>
                                      </Link>
                                    </div>
                                    <div className={s.messages__messageTime}>
                                      {msg.date}
                                    </div>
                                  </div>

                                  <div className={s.messages__messageText}>
                                    {!msg.isFile ? (
                                      <ReactMarkdown>
                                        {msg.message}
                                      </ReactMarkdown>
                                    ) : (
                                      <div className={s.messages__fileMessage}>
                                        <a
                                          href={msg.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{ minWidth: "25px" }}
                                        >
                                          <InsertDriveFileIcon
                                            fontSize="large"
                                            sx={{ color: "#fff" }}
                                          />
                                        </a>
                                        <a
                                          href={msg.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {msg.message}
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <Link href={`/profile/${msg.userId}`} passHref>
                                  <a target="_blank" rel="noopener noreferrer">
                                    {msg.avatar ? (
                                      <div style={{ minWidth: "70px" }}>
                                        <Image
                                          width="70px"
                                          height="70px"
                                          className={s.userAvatar}
                                          src={authData.info[7].avatar}
                                          alt="content__img"
                                        />
                                      </div>
                                    ) : (
                                      <Avatar
                                        {...stringAvatar(
                                          authData.info[0].name +
                                            " " +
                                            authData.info[1].surname
                                        )}
                                        sx={
                                          mw499px
                                            ? {
                                                bgcolor: "#2A2550",
                                                width: "60px",
                                                height: "60px",
                                                fontSize: "20px",
                                              }
                                            : {
                                                bgcolor: "#2A2550",
                                                width: "70px",
                                                height: "70px",
                                                fontSize: "20px",
                                              }
                                        }
                                      />
                                    )}
                                  </a>
                                </Link>
                              </div>
                            ) : (
                              <div className={s.messages__messageLeft}>
                                <Link href={`/profile/${msg.userId}`} passHref>
                                  <a target="_blank" rel="noopener noreferrer">
                                    <StyledBadge
                                      overlap="circular"
                                      anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                      }}
                                      variant="dot"
                                    >
                                      {msg.avatar ? (
                                        <div style={{ minWidth: "70px" }}>
                                          <Image
                                            width="70px"
                                            height="70px"
                                            className={s.userAvatar}
                                            src={msg.avatar}
                                            alt="content__img"
                                          />
                                        </div>
                                      ) : (
                                        <Avatar
                                          {...stringAvatar(
                                            msg.name + " " + msg.surname
                                          )}
                                          sx={
                                            mw499px
                                              ? {
                                                  bgcolor: "#2A2550",
                                                  width: "60px",
                                                  height: "60px",
                                                  fontSize: "20px",
                                                }
                                              : {
                                                  bgcolor: "#2A2550",
                                                  width: "70px",
                                                  height: "70px",
                                                  fontSize: "20px",
                                                }
                                          }
                                        />
                                      )}
                                    </StyledBadge>
                                  </a>
                                </Link>

                                <div
                                  className={
                                    s.messages__messageContainer +
                                    " " +
                                    s.messages__messageContainer_left
                                  }
                                >
                                  <div className={s.messages__messageInfo}>
                                    <div className={s.messages__messageName}>
                                      <Link
                                        href={`/profile/${msg.userId}`}
                                        passHref
                                      >
                                        <a
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {msg.username}
                                        </a>
                                      </Link>
                                    </div>
                                    <div className={s.messages__messageTime}>
                                      {msg.date}
                                    </div>
                                  </div>

                                  <div className={s.messages__messageText}>
                                    {!msg.isFile ? (
                                      <ReactMarkdown>
                                        {msg.message}
                                      </ReactMarkdown>
                                    ) : (
                                      <div className={s.messages__fileMessage}>
                                        <a
                                          href={msg.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {msg.message}
                                        </a>
                                        <a
                                          href={msg.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{ minWidth: "25px" }}
                                        >
                                          <InsertDriveFileIcon
                                            fontSize="large"
                                            sx={{ color: "#fff" }}
                                          />
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              <Snackbar
                open={snackbarState.snackbarOpen}
                TransitionComponent={snackbarState.Transition}
                key={snackbarState.Transition.name}
                sx={{ marginBottom: !mw599px ? "40px" : "57px" }}
              >
                {!uploadingError ? (
                  <div>
                    {!isLoadingOver ? (
                      <Alert
                        severity="info"
                        variant="filled"
                        sx={{
                          backgroundColor: "rgb(2, 136, 209)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ width: "100%", display: "block" }}>
                          <LinearProgressWithLabel
                            value={fileUploadingProgress}
                            filename={fileName}
                          />
                        </Box>
                      </Alert>
                    ) : (
                      <Alert
                        severity="success"
                        variant="filled"
                        sx={{
                          backgroundColor: "rgb(56, 142, 60)",
                          color: "#fff",
                        }}
                      >
                        Done
                      </Alert>
                    )}
                  </div>
                ) : (
                  <Alert
                    severity="error"
                    variant="filled"
                    sx={{
                      backgroundColor: "rgb(211, 47, 47)",
                      color: "#fff",
                    }}
                  >
                    Not enough free space
                  </Alert>
                )}
              </Snackbar>
            </div>
          </section>

          <section className={s.bottom}>
            <form onSubmit={onSubmit} className={s.bottom}>
              <div style={{ display: "flex" }}>
                <Button
                  variant="contained"
                  className={classes.purple}
                  sx={{ borderRadius: 0 }}
                  component="label"
                  onClick={(e: any) => {
                    handleClick(e);
                  }}
                >
                  <AttachFileIcon sx={{ color: "#fff" }} />
                </Button>

                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  onDragStart={(e) => dragStartHandler(e)}
                  onDragLeave={(e) => dragLeaveHandler(e)}
                  onDragOver={(e) => dragStartHandler(e)}
                  onDrop={(e) => onDropHandler(e)}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  PaperProps={{
                    sx: {
                      backgroundColor: "#8479E1",
                      color: "#fff",
                    },
                  }}
                >
                  <div
                    className={s.bottom__dragArea}
                    style={drag ? { border: "2px dashed #000000" } : {}}
                  >
                    <div className={s.bottom__dragAreaInfo}>
                      <div className={s.bottom__provider}>{t("provider")}</div>
                      <div>
                        <div>{t("current_usage")}</div>
                        <div>
                          <span>
                            {authData.limits.freeSpaceTaken && (
                              <>{parseInt(authData.limits.freeSpaceTaken)}</>
                            )}
                            /1000 Mb
                          </span>{" "}
                          <span>{authData.limits.filesSent}/100 files</span>
                        </div>
                      </div>
                    </div>
                    {!mw999px ? (
                      <>
                        <div className={s.bottom__dragAreaIcon}>
                          <label>
                            <FileUploadIcon
                              sx={{ color: "#fff", fontSize: "45px" }}
                            />
                            {hiddenFileUploadInput()}
                          </label>
                        </div>
                        <header>Drag & Drop to Upload File</header>
                        <span>OR</span>
                        <Button
                          variant="contained"
                          color="primary"
                          component="label"
                          sx={{ color: "#000000" }}
                        >
                          {t("browse_files")} {hiddenFileUploadInput()}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        component="label"
                        sx={{ color: "#000000", marginTop: "30px" }}
                      >
                        {ct("got_it")} {hiddenFileUploadInput()}
                      </Button>
                    )}
                  </div>
                </Popover>
              </div>
              <TextField
                id="outlined-basic"
                placeholder="Message"
                variant="outlined"
                sx={{
                  width: "100%",
                  bgcolor: "#fff",
                  borderRadius: "0px",
                  height: "auto",
                }}
                value={value}
                multiline
                maxRows={3}
                fullWidth
                onFocus={() => {
                  if (mw999px) {
                    setTimeout(() => {
                      router.push("#last");
                    }, 100);
                  }
                }}
                onChange={(e) => {
                  setValue(e.target.value);
                  dispatch(enterCharacter());
                }}
                onKeyDown={(e) => {
                  if (
                    e.keyCode === 13 &&
                    !e.shiftKey &&
                    value.replace(/\s+/g, "") !== ""
                  ) {
                    e.preventDefault();
                    sendMessage();
                    dispatch(sendChatMessage());
                    setValue("");
                  }
                }}
              />

              <Link href="#last" passHref>
                <Button
                  variant="contained"
                  className={classes.purple}
                  sx={{ borderRadius: 0 }}
                  onClick={(e) => {
                    if (value.replace(/\s+/g, "") !== "") {
                      sendMessage();
                      dispatch(sendChatMessage());
                    }
                  }}
                >
                  <Send sx={{ color: "#fff" }} />
                </Button>
              </Link>
            </form>
          </section>
        </div>
      </ThemeProvider>
    </MainLayout>
  );
};

const Chat2: React.FC = () => {
  const isAuthed = useAppSelector((state) => state.sign.isAuthed);
  const isAuthFulfilled = useAppSelector((state) => state.sign.isAuthFulfilled);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthed && isAuthFulfilled) {
      router.push("/signup");
    }
  }, [isAuthFulfilled, isAuthed]);

  return <Chat />;
};

export default function InitialChat() {
  const key = useAppSelector((state) => state.sign.uniKey);

  return <Chat2 key={key} />;
}

export async function getServerSideProps({ locale }: ILocale) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "chat"])),
    },
  };
}