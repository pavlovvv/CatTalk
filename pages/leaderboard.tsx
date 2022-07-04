import AbcIcon from "@mui/icons-material/Abc";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { default as KeyboardArrowDown } from "@mui/icons-material/KeyboardArrowDown";
import NumbersIcon from "@mui/icons-material/Numbers";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  CircularProgress,
  createTheme,
  Pagination,
  TableContainer,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { alpha, styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import {
  getUsers,
  searchUsers,
  sortByMostChats,
  sortByMostEnteredCharacters,
  sortByMostSentMessages,
} from "../redux/usersSlice";
import s from "../styles/leaderboard.module.css";
import { useAppDispatch, useAppSelector } from "../typescript/hook";
import {
  IFilteredUser,
  ILeaderBoardCreateUserData,
  ILeaderboardData,
  ILeaderboardRow,
  IStringAvatar,
} from "../typescript/interfaces/data";
import Row from "../components/Leaderboard/Row";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ILocale } from "../typescript/interfaces/data";
import { useTranslation } from "next-i18next";

export async function getStaticProps({ locale }: ILocale) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "leaderboard"])),
    },
  };
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.5),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.7),
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
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "100%",
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

export default function Leaderboard() {
  const dispatch = useAppDispatch();
  const router: any = useRouter();

  const usersData = useAppSelector((state) => state.users.usersData);
  const sort = useAppSelector((state) => state.users.sortBy);
  const totalUsersCount = useAppSelector(
    (state) => state.users.totalUsersCount
  );
  const isPending = useAppSelector((state) => state.users.isPending);
  const isAuthFulfilled = useAppSelector((state) => state.sign.isAuthFulfilled);

  const [rows, setRows] = useState<object[]>([]);
  const [sortBy, setSort] = useState<string | null>("ID");
  const [page, setPage] = useState<number>(1);

  const { t } = useTranslation("leaderboard");

  const data: object[] = [
    { icon: <NumbersIcon />, label: "ID" },
    { icon: <ChatBubbleIcon />, label: t("chats") },
    { icon: <SendIcon />, label: t("sent_messages") },
    { icon: <AbcIcon />, label: t("entered_characters") },
  ];

  function createUsersData(
    username: string,
    id: number,
    totalChats: number,
    totalMessagesSent: number,
    totalCharactersEntered: number,
    name: string,
    surname: string,
    avatar_url: string | null
  ): ILeaderboardRow {
    return {
      username,
      id,
      name,
      surname,
      avatar_url,
      stats: {
        totalChats,
        totalMessagesSent,
        totalCharactersEntered,
      },
    };
  }

  const filteredUsers = useAppSelector((state) => state.users.filteredUsers);

  useEffect(() => {
    if (router.query.search) {
      dispatch(searchUsers({ searchText: router.query.search }));
    }
  }, [router]);

  useEffect(() => {
    if (usersData.length === 0 && !router.query.search && isAuthFulfilled) {
      if (router.query.filter) {
        switch (router.query.filter) {
          case "ID":
            dispatch(
              getUsers({
                page: router.query.page ? router.query.page - 1 : page - 1,
              })
            );
          setSort('ID')
            break;

          case "chats":
            dispatch(
              sortByMostChats({
                page: router.query.page ? router.query.page - 1 : page - 1,
              })
            );
            setSort(t('chats'))
            break;

          case "sent-messages":
            dispatch(
              sortByMostSentMessages({
                page: router.query.page ? router.query.page - 1 : page - 1,
              })
            );
            setSort(t('sent_messages'))
            break;

          case "entered-characters":
            dispatch(sortByMostEnteredCharacters({
              page: router.query.page ? router.query.page - 1 : page - 1,
            }))
            setSort(t('entered_characters'))
            break;

          default:
            break;
        }
      } else {
        dispatch(
          getUsers({
            page: router.query.page ? router.query.page - 1 : page - 1,
          })
        );
      }
    }

    if (filteredUsers.length !== 0 || handlerSearchText.length !== 0) {
      setRows([]);
      filteredUsers.forEach((el: IFilteredUser) => {
        const data = createUsersData(
          el.username,
          el.id,
          el.stats.totalChats,
          el.stats.totalMessagesSent,
          el.stats.totalCharactersEntered,
          el.name,
          el.surname,
          el.avatar
        );

        setRows((prev) => [...prev, data]);
      });
    } else {
      if (usersData) {
        setRows([]);
        usersData.forEach((user: ILeaderBoardCreateUserData) => {
          const data = createUsersData(
            user.info.username,
            user.info.id,
            user.stats.totalChats,
            user.stats.totalMessagesSent,
            user.stats.totalCharactersEntered,
            user.info.name,
            user.info.surname,
            user.info.avatar
          );
          setRows((prev) => [...prev, data]);
        });
      }
    }
  }, [usersData, isAuthFulfilled, filteredUsers, router.query.filter]);

  const mw767px = useMediaQuery("(max-width:767px)");
  const mw715px = useMediaQuery("(max-width:715px)");

  const [open, setOpen] = useState(true);

  const theme = createTheme({
    components: {
      MuiListItemButton: {
        defaultProps: {
          disableTouchRipple: true,
        },
      },
    },
    palette: {
      mode: "dark",
      primary: { main: "rgb(102, 157, 246)" },
      background: { paper: "rgb(5, 30, 52)" },
    },
  });

  const stringAvatar = (name: string): IStringAvatar => {
    return {
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  const [handlerSearchText, setSearchText] = useState<string>("");

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let lowerCase: string = e.target.value.toLowerCase();
    setRows([]);
    setSort("Search");
    setSearchText(lowerCase);
    router.push({
      pathname: "/leaderboard",
      query: { search: lowerCase },
    });
    dispatch(searchUsers({ searchText: lowerCase }));

    if (lowerCase.length === 0) {
      setSort(sort);
      usersData.forEach((user: ILeaderBoardCreateUserData) => {
        const data = createUsersData(
          user.info.username,
          user.info.id,
          user.stats.totalChats,
          user.stats.totalMessagesSent,
          user.stats.totalCharactersEntered,
          user.info.name,
          user.info.surname,
          user.info.avatar
        );
        setRows((prev) => [...prev, data]);
      });
    }
  };

  return (
    <MainLayout>
      <ThemeProvider theme={theme}>
        <div className={s.leaderboardPage}>
          <div className={s.container}>
            <div className={s.panel + " " + s.panel_body}>
              <div className={s.panel__inner}>
                <section className={s.panel__pagination}>
                  <Pagination
                    count={Math.ceil(totalUsersCount / 5)}
                    page={
                      router.query.page
                        ? Number(router.query.page)
                        : Number(page)
                    }
                    showFirstButton
                    showLastButton
                    disabled={!!router.query.search}
                    onChange={(e, num) => {
                      switch (sortBy) {
                        case "ID":
                          router.push({
                            pathname: "/leaderboard",
                            query: { page: num, filter: "ID" },
                          });
                          dispatch(getUsers({ page: num - 1 }));
                          setPage(num);
                          break;

                        case "Chats":
                        case "Чатам":
                        case "Чатами":
                          router.push({
                            pathname: "/leaderboard",
                            query: { page: num, filter: "chats" },
                          });
                          dispatch(sortByMostChats({ page: num - 1 }));
                          setPage(num);
                          break;

                        case "Sent messages":
                        case "Сообщениям":
                        case "Повідовмленням":
                          router.push({
                            pathname: "/leaderboard",
                            query: { page: num, filter: "sent-messages" },
                          });
                          dispatch(sortByMostSentMessages({ page: num - 1 }));
                          setPage(num);
                          break;

                        case "Entered characters":
                        case "Символам":
                        case "Символами":
                          router.push({
                            pathname: "/leaderboard",
                            query: { page: num, filter: "entered-characters" },
                          });
                          dispatch(
                            sortByMostEnteredCharacters({ page: num - 1 })
                          );
                          setPage(num);
                          break;
                        default:
                          break;
                      }
                    }}
                  />
                </section>
                <section className={s.panel__top}>
                  <div className={s.panel__topSearch}>
                    <Search>
                      <SearchIconWrapper>
                        <SearchIcon />
                      </SearchIconWrapper>
                      <StyledInputBase
                        placeholder="Search..."
                        value={router.query.search || handlerSearchText}
                        sx={
                          !mw715px
                            ? { height: "60px", width: "400px" }
                            : { height: "60px", width: "100%" }
                        }
                        inputProps={{ "aria-label": "Search" }}
                        onChange={searchHandler}
                      />
                    </Search>
                  </div>
                  <div className={s.panel__topList}>
                    <ListItemButton
                      alignItems="flex-start"
                      onClick={() => setOpen(!open)}
                      sx={{
                        px: 3,
                        pt: 2.5,
                        pb: open ? 0 : 2.5,
                        "&:hover, &:focus": { "& svg": { opacity: 1 } },
                      }}
                    >
                      <ListItemText
                        primary={t("sort_by")}
                        primaryTypographyProps={{
                          fontSize: 15,
                          fontWeight: 900,
                          lineHeight: "20px",
                          marginBottom: "10px",
                          color: "#fff",
                        }}
                        sx={{ my: 0 }}
                      />
                      <KeyboardArrowDown
                        sx={{
                          mr: -1,
                          opacity: 1,
                          transform: open ? "rotate(-180deg)" : "rotate(0)",
                          transition: "0.2s",
                          color: "#fff",
                        }}
                      />
                    </ListItemButton>
                    {open &&
                      data.map((item: ILeaderboardData) => (
                        <ListItemButton
                          disabled={!!router.query.search}
                          key={item.label}
                          sx={
                            item.label !== sortBy
                              ? {
                                  py: 0,
                                  minHeight: 32,
                                  color: "rgba(255,255,255,.8)",
                                }
                              : {
                                  py: 0,
                                  minHeight: 32,
                                  color: "rgba(255,255,255,.8)",
                                  bgcolor: "rgba(355, 355, 355, 0.1)",
                                }
                          }
                          onClick={() => {
                            switch (item.label) {
                              case "ID":
                                router.push({
                                  pathname: "/leaderboard",
                                  query: { page, filter: "ID" },
                                });
                                dispatch(getUsers({ page: page - 1 }));
                                setSort("ID");
                                break;

                              case "Chats":
                              case "Чатам":
                              case "Чатами":
                                router.push({
                                  pathname: "/leaderboard",
                                  query: { page, filter: "chats" },
                                });
                                dispatch(sortByMostChats({ page: page - 1 }));
                                setSort(t('chats'));
                                break;

                              case "Sent messages":
                              case "Сообщениям":
                              case "Повідомленнями":
                                router.push({
                                  pathname: "/leaderboard",
                                  query: { page, filter: "sent-messages" },
                                });
                                dispatch(
                                  sortByMostSentMessages({ page: page - 1 })
                                );
                                setSort(t('sent_messages'));
                                break;

                              case "Entered characters":
                              case "Символам":
                              case "Символами":
                                router.push({
                                  pathname: "/leaderboard",
                                  query: { page, filter: "entered-characters" },
                                });
                                dispatch(
                                  sortByMostEnteredCharacters({
                                    page: page - 1,
                                  })
                                );
                                setSort(t('entered_characters'));
                                break;
                              default:
                                break;
                            }
                          }}
                        >
                          <ListItemIcon sx={{ color: "inherit" }}>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                              fontSize: 14,
                              fontWeight: "medium",
                            }}
                          />
                        </ListItemButton>
                      ))}
                  </div>
                </section>
                <section className={s.panel__users}>
                  {isPending ? (
                    <CircularProgress
                      size={60}
                      sx={{ display: "block", margin: "auto", color: "#fff" }}
                    />
                  ) : (
                    <div>
                      {!mw767px ? (
                        <Table aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 900 }}>ID</TableCell>
                              <TableCell sx={{ fontWeight: 900 }}>
                                {t("username")}
                              </TableCell>
                              <TableCell sx={{ fontWeight: 900 }} align="right">
                                {t("total_chats")}
                              </TableCell>
                              <TableCell sx={{ fontWeight: 900 }} align="right">
                                {t("total_sent_messages")}
                              </TableCell>
                              <TableCell sx={{ fontWeight: 900 }} align="right">
                                {t("total_entered_characters")}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rows.map((row: ILeaderboardRow) => (
                              <TableRow
                                key={row.username}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell sx={{ fontFamily: "Quicksand" }}>
                                  {row.id}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  <Link href={`/profile/${row.id}`} passHref>
                                    <a
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          marginBottom: "-1px",
                                          columnGap: "20px",
                                          fontFamily: "Quicksand",
                                        }}
                                      >
                                        {row.avatar_url ? (
                                          <Image
                                            width="55px"
                                            height="55px"
                                            style={{ borderRadius: "50%" }}
                                            src={row.avatar_url}
                                            alt="content__img"
                                          />
                                        ) : (
                                          <Avatar
                                            {...stringAvatar(
                                              row.name + " " + row.surname
                                            )}
                                            sx={{
                                              bgcolor: "#fff",
                                              width: "55px",
                                              height: "55px",
                                              fontSize: "20px",
                                            }}
                                          />
                                        )}
                                        {row.username}
                                      </Box>
                                    </a>
                                  </Link>
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ fontFamily: "Quicksand" }}
                                >
                                  {row.stats.totalChats}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ fontFamily: "Quicksand" }}
                                >
                                  {row.stats.totalMessagesSent}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ fontFamily: "Quicksand" }}
                                >
                                  {row.stats.totalCharactersEntered}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <TableContainer>
                          <Table aria-label="collapsible table">
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  sx={{ fontWeight: 900, paddingLeft: "80px" }}
                                >
                                  {t('username')}
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows.map((row: ILeaderboardRow, idx: number) => (
                                <Row key={idx} row={row} idx={idx} t={t} />
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </MainLayout>
  );
}
