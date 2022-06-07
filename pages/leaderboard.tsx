import AbcIcon from "@mui/icons-material/Abc";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import {
    default as KeyboardArrowDown,
    default as KeyboardArrowDownIcon
} from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
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
    useMediaQuery
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
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
import * as React from "react";
import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import {
    getUsers,
    searchUsers,
    sortByMostChats,
    sortByMostEnteredCharacters,
    sortByMostSentMessages
} from "../redux/usersSlice";
import s from "../styles/leaderboard.module.css";
import { useAppDispatch, useAppSelector } from "../typescript/hook";
import {
    IFilteredUser,
    ILeaderBoardCreateUserData,
    ILeaderboardData, ILeaderboardRow,
    IStringAvatar
} from "../typescript/interfaces/data";

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

const Row = (props: any) => {
  const { row } = props;
  const [open, setOpen] = useState<boolean>(false);

  const stringAvatar = (name: string): IStringAvatar => {
    return {
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };
  return (
    <>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <TableCell sx={{ marginBottom: 0 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: "20px",
            fontFamily: "Quicksand",
            width: "100%",
          }}
        >
          <Link href={`/profile/${row.id}`} passHref>
            <a target="_blank" rel="noopener noreferrer">
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
                    width="40px"
                    height="40px"
                    style={{ borderRadius: "50%" }}
                    src={row.avatar_url}
                    alt="content__img"
                  />
                ) : (
                  <Avatar
                    {...stringAvatar(row.name + " " + row.surname)}
                    sx={{
                      bgcolor: "#fff",
                      width: "40px",
                      height: "40px",
                      fontSize: "15px",
                    }}
                  />
                )}
                {row.username}
              </Box>
            </a>
          </Link>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900 }}>Total chats</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>
                      Total messages sent
                    </TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>
                      Total entered characters
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontFamily: "Quicksand" }}
                    >
                      {row.stats.totalChats}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Quicksand" }}>
                      {row.stats.totalMessagesSent}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Quicksand" }}>
                      {row.stats.totalCharactersEntered}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

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

  const data: object[] = [
    { icon: <NumbersIcon />, label: "ID" },
    { icon: <ChatBubbleIcon />, label: "Chats" },
    { icon: <SendIcon />, label: "Sent messages" },
    { icon: <AbcIcon />, label: "Entered characters" },
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
    if (usersData.length === 0 && isAuthFulfilled) {
      dispatch(getUsers({ page: page - 1 }));
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
  }, [usersData, isAuthFulfilled, filteredUsers]);

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
            <div>&nbsp;</div>
            <div className={s.panel + " " + s.panel_body}>
              <div className={s.panel__inner}>
                <section className={s.panel__pagination}>
                  <Pagination
                    count={Math.ceil(totalUsersCount / 5)}
                    page={page}
                    showFirstButton
                    showLastButton
                    disabled={sortBy === "Search"}
                    onChange={(e, num) => {
                      switch (sortBy) {
                        case "ID":
                          dispatch(getUsers({ page: num - 1 }));
                          setPage(num);
                          break;

                        case "Chats":
                          dispatch(sortByMostChats({ page: num - 1 }));
                          setPage(num);
                          break;

                        case "Sent messages":
                          dispatch(sortByMostSentMessages({ page: num - 1 }));
                          setPage(num);
                          break;

                        case "Entered characters":
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
                        primary="Sort by"
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
                                dispatch(getUsers({ page: page - 1 }));
                                setSort("ID");
                                break;

                              case "Chats":
                                dispatch(sortByMostChats({ page: page - 1 }));
                                setSort("Chats");
                                break;

                              case "Sent messages":
                                dispatch(
                                  sortByMostSentMessages({ page: page - 1 })
                                );
                                setSort("Sent messages");
                                break;

                              case "Entered characters":
                                dispatch(
                                  sortByMostEnteredCharacters({
                                    page: page - 1,
                                  })
                                );
                                setSort("Entered characters");
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
                                Username
                              </TableCell>
                              <TableCell sx={{ fontWeight: 900 }} align="right">
                                Total chats
                              </TableCell>
                              <TableCell sx={{ fontWeight: 900 }} align="right">
                                Total sent messages
                              </TableCell>
                              <TableCell sx={{ fontWeight: 900 }} align="right">
                                Total entered characters
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
                                  Username
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows.map((row: ILeaderboardRow, idx: number) => (
                                <Row key={idx} row={row} idx={idx} />
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
            <div>&nbsp;</div>
          </div>
        </div>
      </ThemeProvider>
    </MainLayout>
  );
}
