import React from "react";
import {
  Alert,
  Avatar, Button, CircularProgress, createTheme, Popover, ThemeProvider, Typography
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import discordIcon from "../../images/discord-icon.svg";
import instagramIcon from "../../images/Instagram_icon.png";
import telegramIcon from "../../images/Telegram_icon.png";
import {
  addFriend, deleteFriend, refuseOwnFriendRequest
} from "../../redux/usersSlice";
import s from "../../styles/profile.module.css";
import { useAppDispatch, useAppSelector } from "../../typescript/hook";
import {
  IProfileConfirmedFriend, IProfileFriend,
  IProfileFriends, IProfileGetServerSideProps,
  IProfileProps, IStringAvatar, 
} from "../../typescript/interfaces/data.js";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';


export async function getServerSideProps({
  params, 
  locale
}: IProfileGetServerSideProps) {
  const res = await fetch(
    `https://cattalkapi.herokuapp.com/users/search/${params.id}`
  );
  const user = await res.json();

  return { props: {...(await serverSideTranslations(locale, ['common', 'profile'])), userData: user }, };
}

export default function Profile(props: IProfileProps) {
  const [friends, setFriends] = useState<IProfileFriends>({
    confirmedFriends: [],
    pendingFriends: [],
    waitingFriends: [],
    totalFriendsCount: 0,
  });
  const [infoOption, setInfo] = useState<string>("info");
  const [isFriendsAdvanced, setFriendsAdvanced] = useState<boolean>(false);
  const [isFriend, setFriend] = useState<object[]>([]);
  const [info, setInform] = useState<any>([]);
  const [stats, setStats] = useState<any>([]);
  const [isFriendPending, setFriendPending] = useState<object[]>([]);
  const authData = useAppSelector((state) => state.sign.userData);
  const isProfilePending = useAppSelector(
    (state) => state.users.isProfilePending
  );
  const key = useAppSelector((state) => state.users.key);
  const isDone = useAppSelector((state) => state.sign.isProfileDone);
  const isAuthed = useAppSelector((state) => state.sign.isAuthed);
  const isProfileUpdatingConfirmed = useAppSelector(
    (state) => state.sign.isProfileUpdatingConfirmed
  );

  const router = useRouter();

  const dispatch = useAppDispatch();

  useEffect(() => {

    if (props.userData) {
      setInform(
        Object.entries(props.userData.info).map((entry) => ({
          [entry[0]]: entry[1],
        }))
      );
      setStats(
        Object.entries(props.userData.stats).map((entry) => ({
          [entry[0]]: entry[1],
        }))
      );

        setFriends(props.userData.friends);

      if (authData) {
        const friend = authData.friends.confirmedFriends?.filter(
          (e: IProfileFriend) => {
            if (e.id === props.userData.info.id) return e;
          }
        );

        setFriend(friend);

        const pendingFriend = authData.friends.pendingFriends?.filter(
          (e: IProfileFriend) => {
            if (e.id === props.userData.info.id) return e;
          }
        );

        setFriendPending(pendingFriend);
      }
    }

    if (key > 0) {
      router.push(router.asPath);
    }
  }, [props, authData, key]);

  const {t} = useTranslation('profile')

  const statistics: string[] = [
    t("total_chats"),
    t("total_messages_sent"),
    t("total_entered_characters"),
  ];

  const theme = createTheme({
    palette: {
      secondary: {
        main: "#333C83",
      },
    },
  });

  const stringAvatar = (name: string): IStringAvatar => {
    return {
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  const [anchorTelegramEl, setAnchorTelegramEl] = useState<HTMLElement | null>(
    null
  );
  const [anchorDiscordEl, setAnchorDiscordEl] = useState<HTMLElement | null>(
    null
  );
  const [isTelegramCopied, setTelegramCopy] = useState<boolean>(false);
  const [isDiscordCopied, setDiscordCopy] = useState<boolean>(false);

  const handlePopoverTelegramOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorTelegramEl(event.currentTarget);
  };

  const handlePopoverTelegramClose = (): void => {
    setAnchorTelegramEl(null);
  };

  const handlePopoverDiscordOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorDiscordEl(event.currentTarget);
  };

  const handlePopoverDiscordClose = (): void => {
    setAnchorDiscordEl(null);
  };

  const telegramOpen: boolean = Boolean(anchorTelegramEl);
  const discordOpen: boolean = Boolean(anchorDiscordEl);

  return (
    <MainLayout>
      <ThemeProvider theme={theme}>
        <div>
          <section className={s.top}>
            <div className={s.container}>
              <div className={s.top__items}>
                <div className={s.top__ava}>
                  {info[7]?.avatar ? (
                    <Image
                      width="150px"
                      height="150px"
                      className={s.top__img}
                      src={info[7].avatar}
                      alt="content__img"
                    />
                  ) : (
                    <Avatar
                      {...stringAvatar(info[0]?.name + " " + info[1]?.surname)}
                      sx={{
                        bgcolor: "#2A2550",
                        width: "150px",
                        height: "150px",
                        fontSize: "35px",
                      }}
                    />
                  )}
                </div>
                <div className={s.top__logotext}>
                  <h2>
                    {info[0]?.name} {info[1]?.surname}
                  </h2>
                </div>
              </div>
            </div>
          </section>

          <section className={s.info}>
            <div className={s.container}>
              <div className={s.info__inner}>
                <div className={s.panel + " " + s.info__info}>
                  <div>
                    {isProfileUpdatingConfirmed && (
                      <Alert
                        severity="success"
                        variant="filled"
                        sx={{ backgroundColor: "#4E9F3D", color: "#fff" }}
                      >
                        {t('updating_confirmed')}
                      </Alert>
                    )}
                    {infoOption === "info" ? (
                      <div>
                        <div className={s.info__menu}>
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{ width: "125px" }}
                          >
                            {t('info')}
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ width: "125px" }}
                            onClick={() => {
                              setInfo("stats");
                            }}
                          >
                            {t('statistics')}
                          </Button>

                          {isAuthed && authData.info[4]?.id !== info[4]?.id && authData.type !== 'Guest' && (
                            <>
                              {isFriend?.length === 0 &&
                                isFriendPending?.length === 0 && (
                                  <Button
                                    color="success"
                                    variant="contained"
                                    sx={{
                                      backgroundColor: "#4E9F3D",
                                      color: "#fff",
                                    }}
                                    onClick={() => {
                                      dispatch(
                                        addFriend({
                                          id: info[4].id,
                                          name: info[0].name,
                                          surname: info[1].surname,
                                          username: info[2].username,
                                          avatar: info[7].avatar,
                                        })
                                      );
                                    }}
                                    disabled={isProfilePending || isDone}
                                  >
                                    {isProfilePending || isDone ? (
                                      <div
                                        style={{
                                          color: "#fff",
                                          display: "flex",
                                          alignItems: "center",
                                          columnGap: "10px",
                                        }}
                                      >
                                        <CircularProgress
                                          size={30}
                                          sx={{ color: "#fff" }}
                                        />{" "}
                                        {t('add_friend')}{" "}
                                      </div>
                                    ) : (
                                      <>{t('add_friend')}</>
                                    )}
                                  </Button>
                                )}

                              {isFriendPending?.length !== 0 && (
                                <Button
                                  color="success"
                                  variant="outlined"
                                  sx={{
                                    borderColor: "#4E9F3D",
                                    color: "#4E9F3D",
                                  }}
                                  onClick={() => {
                                    dispatch(
                                      refuseOwnFriendRequest({ id: info[4].id })
                                    );
                                  }}
                                  disabled={isProfilePending || isDone}
                                >
                                  {isProfilePending || isDone ? (
                                    <div
                                      style={{
                                        color: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        columnGap: "10px",
                                      }}
                                    >
                                      <CircularProgress
                                        size={30}
                                        sx={{ color: "#fff" }}
                                      />
                                      {t('request')}{" "}
                                    </div>
                                  ) : (
                                    <>{t('request')}</>
                                  )}
                                </Button>
                              )}

                              {isFriend?.length !== 0 && (
                                <Button
                                  color="error"
                                  variant="contained"
                                  sx={{
                                    backgroundColor: "rgb(211, 47, 47)",
                                    color: "#fff",
                                  }}
                                  disabled={isProfilePending || isDone}
                                  onClick={() => {
                                    dispatch(deleteFriend({ id: info[4].id }));
                                  }}
                                >
                                  {isProfilePending || isDone ? (
                                    <div
                                      style={{
                                        color: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        columnGap: "10px",
                                      }}
                                    >
                                      <CircularProgress
                                        size={30}
                                        sx={{ color: "#fff" }}
                                      />
                                      {t('delete_friend')}{" "}
                                    </div>
                                  ) : (
                                    <>{t('delete_friend')}</>
                                  )}
                                </Button>
                              )}
                            </>
                          )}

                    {authData.type === 'Guest' && (<Button
                                  color="error"
                                  variant="contained"
                                  sx={{
                                    backgroundColor: "rgb(211, 47, 47)",
                                    color: "#fff",
                                  }}
                                >{t('guests')}</Button>)}
                        </div>

                        {info.map((e: object, i: number) => {
                          const key: string[] = Object.keys(e);
                          const value: string[] = Object.values(e);
                          return (
                            <div key={i}>
                              {key[0] !== "_id" &&
                                key[0] !== "instagramLink" &&
                                key[0] !== "telegramUsername" &&
                                key[0] !== "discordUsername" &&
                                key[0] !== "avatar" && (
                                  <div>
                                    <div className={s.info__infoItems}>
                                      <span className={s.info__infoItemName}>
                                        {key[0]}
                                      </span>
                                      <span className={s.info__infoItemValue}>
                                        {value[0] ?? "unknown"}
                                      </span>
                                    </div>

                                    {i !== info.length - 5 && (
                                      <hr className={s.hrUnder} />
                                    )}
                                  </div>
                                )}
                            </div>
                          );
                        })}

                        <div className={s.info__links}>
                          {info[8]?.instagramLink && (
                            <div>
                              <Link href={info[8].instagramLink}>
                                <a target="_blank">
                                  <Image
                                    src={"/" + instagramIcon.src}
                                    width='50px'
                                    height='50px'
                                    alt="instagramIcon"
                                  />
                                </a>
                              </Link>
                            </div>
                          )}
                          {info[9]?.telegramUsername && (
                            <div style={{ cursor: "pointer" }}>
                              <Image
                                src={"/" + telegramIcon.src}
                                width='50px'
                                height='50px'
                                onMouseEnter={handlePopoverTelegramOpen}
                                onMouseLeave={handlePopoverTelegramClose}
                                alt="telegramIcon"
                                onClick={() => {
                                  setTelegramCopy(true);
                                  setDiscordCopy(false);
                                  navigator.clipboard.writeText(
                                    info[9].telegramUsername
                                  );
                                }}
                              />

                              <Popover
                                id="mouse-over-popover"
                                sx={{
                                  pointerEvents: "none",
                                }}
                                open={telegramOpen}
                                anchorEl={anchorTelegramEl}
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "left",
                                }}
                                transformOrigin={{
                                  vertical: "top",
                                  horizontal: "left",
                                }}
                                onClose={handlePopoverTelegramClose}
                                disableRestoreFocus
                                PaperProps={{
                                  sx: {
                                    backgroundColor: "rgb(5, 30, 52)",
                                    color: "#fff",
                                  },
                                }}
                              >
                                <Typography sx={{ p: 1 }}>
                                  {!isTelegramCopied
                                    ? "Click to copy"
                                    : "Copied!"}
                                </Typography>
                              </Popover>
                            </div>
                          )}

                          {info[10]?.discordUsername && (
                            <div style={{ cursor: "pointer" }}>
                              <Image
                                src={"/" + discordIcon.src}
                                width='50px'
                                height='50px'
                                onMouseEnter={handlePopoverDiscordOpen}
                                onMouseLeave={handlePopoverDiscordClose}
                                alt="discordIcon"
                                onClick={() => {
                                  setDiscordCopy(true);
                                  setTelegramCopy(false);
                                  navigator.clipboard.writeText(
                                    info[10].discordUsername
                                  );
                                }}
                              />

                              <Popover
                                id="mouse-over-popover"
                                sx={{
                                  pointerEvents: "none",
                                }}
                                open={discordOpen}
                                anchorEl={anchorDiscordEl}
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "left",
                                }}
                                transformOrigin={{
                                  vertical: "top",
                                  horizontal: "left",
                                }}
                                onClose={handlePopoverDiscordClose}
                                disableRestoreFocus
                                PaperProps={{
                                  sx: {
                                    backgroundColor: "rgb(5, 30, 52)",
                                    color: "#fff",
                                  },
                                }}
                              >
                                <Typography sx={{ p: 1 }}>
                                  {!isDiscordCopied
                                    ? "Click to copy"
                                    : "Copied!"}
                                </Typography>
                              </Popover>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className={s.info__menu}>
                          <Button
                            variant="contained"
                            sx={{ width: "125px" }}
                            onClick={() => {
                              setInfo("info");
                            }}
                          >
                            {t('info')}
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{ width: "125px" }}
                          >
                            {t('statistics')}
                          </Button>

                          {isAuthed && authData.info[4]?.id !== info[4]?.id && (
                            <>
                              {isFriend?.length === 0 &&
                                isFriendPending?.length === 0 && (
                                  <Button
                                    color="success"
                                    variant="contained"
                                    sx={{
                                      backgroundColor: "#4E9F3D",
                                      color: "#fff",
                                    }}
                                    onClick={() => {
                                      dispatch(
                                        addFriend({
                                          id: info[4].id,
                                          username: info[2].username,
                                          avatar: info[7].avatar,
                                        })
                                      );
                                    }}
                                    disabled={isProfilePending || isDone}
                                  >
                                    {isProfilePending || isDone ? (
                                      <div
                                        style={{
                                          color: "#fff",
                                          display: "flex",
                                          alignItems: "center",
                                          columnGap: "10px",
                                        }}
                                      >
                                        <CircularProgress
                                          size={30}
                                          sx={{ color: "#fff" }}
                                        />{" "}
                                        {t('add_friend')}{" "}
                                      </div>
                                    ) : (
                                      <>{t('add_friend')}</>
                                    )}
                                  </Button>
                                )}

                              {isFriendPending?.length !== 0 && (
                                <Button
                                  color="success"
                                  variant="outlined"
                                  sx={{
                                    borderColor: "#4E9F3D",
                                    color: "#4E9F3D",
                                  }}
                                  onClick={() => {
                                    dispatch(
                                      refuseOwnFriendRequest({ id: info[4].id })
                                    );
                                  }}
                                  disabled={isProfilePending || isDone}
                                >
                                  {isProfilePending || isDone ? (
                                    <div
                                      style={{
                                        color: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        columnGap: "10px",
                                      }}
                                    >
                                      <CircularProgress
                                        size={30}
                                        sx={{ color: "#fff" }}
                                      />
                                      {t('request')}{" "}
                                    </div>
                                  ) : (
                                    <>{t('request')}</>
                                  )}
                                </Button>
                              )}

                              {isFriend?.length !== 0 && (
                                <Button
                                  color="error"
                                  variant="contained"
                                  sx={{
                                    backgroundColor: "rgb(211, 47, 47)",
                                    color: "#fff",
                                  }}
                                  disabled={isProfilePending || isDone}
                                  onClick={() => {
                                    dispatch(deleteFriend({ id: info[4].id }));
                                  }}
                                >
                                  {isProfilePending || isDone ? (
                                    <div
                                      style={{
                                        color: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        columnGap: "10px",
                                      }}
                                    >
                                      <CircularProgress
                                        size={30}
                                        sx={{ color: "#fff" }}
                                      />
                                      {t('delete_friend')}{" "}
                                    </div>
                                  ) : (
                                    <>{t('delete_friend')}</>
                                  )}
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                        {stats.map((e: object, i: number) => {
                          const value = Object.values(e);
                          return (
                            <div key={i}>
                              <div className={s.info__infoItems}>
                                <span className={s.info__infoItemName}>
                                  {statistics[i]}
                                </span>
                                <span className={s.info__infoItemValue}>
                                  {value[0]}
                                </span>
                              </div>

                              {i !== stats.length - 1 && (
                                <hr className={s.hrUnder} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}{" "}
                  </div>
                </div>

                <div className={s.panel + " " + s.info__friends}>
                  <h3
                    className={
                      s.title +
                      " " +
                      s.title_center +
                      " " +
                      s.title_fontSize_25px
                    }
                  >
                    {t('friends')}
                  </h3>

                  <div className={s.info__friendsItems}>
                    {friends.totalFriendsCount !== 0 && !isFriendsAdvanced && (
                      <div>
                        {friends.confirmedFriends!.map(
                          (e: IProfileConfirmedFriend | null, i: number) => {
                            return (
                              <div key={i}>
                                {i <= 2 && (
                                  <Link href={`/profile/${e!.id}`}>
                                    <a target="_blank">
                                      <div
                                        className={
                                          s.infoMemberItem +
                                          " " +
                                          s.infoMemberItem_margin_20px0
                                        }
                                      >
                                        {e!.avatar ? (
                                          <Image
                                            width="75px"
                                            height="75px"
                                            className={s.infoMemberItem__ava}
                                            src={e!.avatar}
                                            alt="ava"
                                          />
                                        ) : (
                                          <Avatar
                                            {...stringAvatar(
                                              e!.name + " " + e!.surname
                                            )}
                                            sx={{
                                              bgcolor: "#333C83",
                                              width: "75px",
                                              height: "75px",
                                              fontSize: "25px",
                                              fontFamily: "Quicksand",
                                            }}
                                          />
                                        )}

                                        <div className={s.infoMemberItem__text}>
                                          <span
                                            className={s.infoMemberItem__name}
                                          >
                                            {e!.name}
                                          </span>
                                          <br />
                                          <span
                                            className={
                                              s.infoMemberItem__surname
                                            }
                                          >
                                            {e!.surname}
                                          </span>
                                        </div>
                                      </div>
                                    </a>
                                  </Link>
                                )}
                                {i !== friends.confirmedFriends!.length - 1 &&
                                  i <= 1 && <hr className={s.hrUnder} />}
                              </div>
                            );
                          }
                        )}

                        {friends.confirmedFriends?.length! > 3 && (
                          <div
                            className={s.showAndHide}
                            onClick={() => {
                              setFriendsAdvanced(true);
                            }}
                          >
                            Show {friends.confirmedFriends!.length - 3} more
                          </div>
                        )}
                      </div>
                    )}

                    {friends.totalFriendsCount !== 0 && isFriendsAdvanced && (
                      <div>
                        {friends.confirmedFriends!.map(
                          (e: IProfileConfirmedFriend | null, i: number) => {
                            return (
                              <div key={i}>
                                <Link href={`/profile/${e!.id}`}>
                                  <a target="_blank">
                                    <div
                                      className={
                                        s.infoMemberItem +
                                        " " +
                                        s.infoMemberItem_margin_20px0
                                      }
                                    >
                                      {e!.avatar ? (
                                        <Image
                                          width="75px"
                                          height="75px"
                                          className={s.infoMemberItem__ava}
                                          src={e!.avatar}
                                          alt="ava"
                                        />
                                      ) : (
                                        <Avatar
                                          {...stringAvatar(
                                            e!.name + " " + e!.surname
                                          )}
                                          sx={{
                                            bgcolor: "#333C83",
                                            width: "75px",
                                            height: "75px",
                                            fontSize: "25px",
                                            fontFamily: "Quicksand",
                                          }}
                                        />
                                      )}

                                      <div className={s.infoMemberItem__text}>
                                        <span
                                          className={s.infoMemberItem__name}
                                        >
                                          {e!.name}
                                        </span>
                                        <br />
                                        <span
                                          className={s.infoMemberItem__surname}
                                        >
                                          {e!.surname}
                                        </span>
                                      </div>
                                    </div>
                                  </a>
                                </Link>
                                {i !== friends.confirmedFriends!.length - 1 && (
                                  <hr className={s.hrUnder} />
                                )}
                              </div>
                            );
                          }
                        )}
                        <div
                          className={s.showAndHide}
                          onClick={() => {
                            setFriendsAdvanced(false);
                          }}
                        >
                          Hide
                        </div>
                      </div>
                    )}

                    {friends.totalFriendsCount === 0 && (
                      <div>
                        <Alert
                          severity="info"
                          variant="filled"
                          sx={{
                            backgroundColor: "rgb(2, 136, 209)",
                            color: "#fff",
                            width: "100%",
                          }}
                        >
                          {t('no_friends2')}
                        </Alert>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </ThemeProvider>
    </MainLayout>
  );
}
