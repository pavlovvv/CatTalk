import SettingsIcon from "@mui/icons-material/Settings";
import {
  Alert,
  Avatar,
  Button,
  createTheme,
  Popover,
  ThemeProvider,
  Typography
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import ProfileChanging from "../../components/Profile/ProfileChanging";
import s from "../../styles/profile.module.scss";
import { useAppSelector } from "../../typescript/hook";
import {
  ILocale, IProfileConfirmedFriend,
  IStringAvatar
} from "../../typescript/interfaces/data";
import discordIcon from "/images/discord-icon.svg";
import instagramIcon from "/images/Instagram_icon.png";
import telegramIcon from "/images/Telegram_icon.png";

export async function getStaticProps({ locale }: ILocale) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "profile"])),
    },
  };
}

const Profile: React.FC = () => {
  const { t } = useTranslation("profile");
  const ct = useTranslation("common").t;

  const stats: string[] = [
    t("total_chats"),
    t("total_messages_sent"),
    t("total_entered_characters"),
  ];

  const [infoOption, setInfo] = useState<string>("info");
  const [isChanging, setChanging] = useState<boolean>(false);
  const [isFriendsAdvanced, setFriendsAdvanced] = useState<boolean>(false);

  const authData = useAppSelector((state) => state.sign.userData);

  const theme = createTheme({
    palette: {
      secondary: {
        main: "#333C83",
      },
    },
  });

  const isProfileUpdatingConfirmed = useAppSelector(
    (state) => state.sign.isProfileUpdatingConfirmed
  );

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

  const handlePopoverTelegramOpen = (
    event: React.MouseEvent<HTMLElement>
  ): void => {
    setAnchorTelegramEl(event.currentTarget);
  };

  const handlePopoverTelegramClose = (): void => {
    setAnchorTelegramEl(null);
  };

  const handlePopoverDiscordOpen = (
    event: React.MouseEvent<HTMLElement>
  ): void => {
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
        <div style={{ overflow: "hidden" }}>
          <section className={s.top}>
            <div className={s.container}>
              <div className={s.top__items}>
                <div className={s.top__ava}>
                  {authData.info[7]?.avatar ? (
                    <Image
                      width="150px"
                      height="150px"
                      className={s.top__img}
                      src={authData.info[7].avatar}
                      alt="CatTalk content__img"
                    />
                  ) : (
                    <Avatar
                      {...stringAvatar(
                        authData.info[0]?.name + " " + authData.info[1]?.surname
                      )}
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
                    {authData.info[0]?.name} {authData.info[1]?.surname}
                  </h2>
                </div>
              </div>
            </div>
          </section>

          <section className={s.info}>
            <div className={s.container}>
              <div className={s.info__inner}>
                <div className={isProfileUpdatingConfirmed ? s.panel + " " + s.info__infoConfirmed : s.panel + " " + s.info__info}>
                  {!isChanging ? (
                    <>
                      {isProfileUpdatingConfirmed && (
                        <Alert
                          severity="success"
                          variant="filled"
                          sx={{ backgroundColor: "#4E9F3D", color: "#fff" }}
                        >
                          {t("updating_confirmed")}
                        </Alert>
                      )}
                      {infoOption === "info" ? (
                        <>
                          <div className={s.info__menu}>
                            <Button
                              variant="contained"
                              color="secondary"
                              sx={{ width: "125px" }}
                            >
                              {t("info")}
                            </Button>
                            <Button
                              variant="contained"
                              sx={{ width: "125px" }}
                              onClick={() => {
                                setInfo("stats");
                              }}
                            >
                              {t("statistics")}
                            </Button>

                            <div
                              className={s.info__settingsIcon}
                              onClick={() => {
                                setChanging(true);
                              }}
                            >
                              <SettingsIcon fontSize="large" />
                            </div>
                          </div>

                          {authData.info.map((e: object, i: number) => {
                            const key = Object.keys(e);
                            const value = Object.values(e);

                            return (
                              <React.Fragment key={i}>
                                {key[0] !== "_id" &&
                                  key[0] !== "instagramLink" &&
                                  key[0] !== "telegramUsername" &&
                                  key[0] !== "discordUsername" &&
                                  key[0] !== "avatar" && (
                                    <div>
                                      <div className={s.items + ' ' + s.items_padding}>
                                        <span className={s.items__name}>
                                          {key[0]}
                                        </span>
                                        <span className={s.items__value}>
                                          {value[0] ?? "unknown"}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                              </React.Fragment>
                            );
                          })}
                          <div className={s.info__links}>
                            {authData.info[8]?.instagramLink && (
                              <div>
                                <Link href={authData.info[8].instagramLink}>
                                  <a target="_blank">
                                    <Image
                                      src={"/" + instagramIcon.src}
                                      width="50px"
                                      height="50px"
                                      alt="CatTalk instagramIcon"
                                    />
                                  </a>
                                </Link>
                              </div>
                            )}
                            {authData.info[9]?.telegramUsername && (
                              <div style={{ cursor: "pointer" }}>
                                <Image
                                  src={"/" + telegramIcon.src}
                                  width="50px"
                                  height="50px"
                                  onMouseEnter={handlePopoverTelegramOpen}
                                  onMouseLeave={handlePopoverTelegramClose}
                                  alt="CatTalk telegramIcon"
                                  onClick={() => {
                                    setTelegramCopy(true);
                                    setDiscordCopy(false);
                                    navigator.clipboard.writeText(
                                      authData.info[9].telegramUsername
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

                            {authData.info[10]?.discordUsername && (
                              <div style={{ cursor: "pointer" }}>
                                <Image
                                  src={"/" + discordIcon.src}
                                  width="50px"
                                  height="50px"
                                  onMouseEnter={handlePopoverDiscordOpen}
                                  onMouseLeave={handlePopoverDiscordClose}
                                  alt="CatTalk discordIcon"
                                  onClick={() => {
                                    setDiscordCopy(true);
                                    setTelegramCopy(false);
                                    navigator.clipboard.writeText(
                                      authData.info[10].discordUsername
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
                        </>
                      ) : (
                        <div className={s.info__stats}>
                          <div className={s.info__menu}>
                            <Button
                              variant="contained"
                              sx={{ width: "125px" }}
                              onClick={() => {
                                setInfo("info");
                              }}
                            >
                              {t("info")}
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              sx={{ width: "125px" }}
                            >
                              {t("statistics")}
                            </Button>
                          </div>
                          {authData.stats.map((e, i) => {
                            const value = Object.values(e);
                            return (
                              <div key={i}>
                                <div className={s.items + ' ' + s.items_padding}>
                                  <span className={s.items__name}>
                                    {stats[i]}
                                  </span>
                                  <span className={s.items__value}>
                                    {value[0]}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}{" "}
                    </>
                  ) : (
                    <ProfileChanging
                      info={authData.info}
                      setChanging={setChanging}
                    />
                  )}
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
                    {t("friends")}
                  </h3>

                  <div className={s.info__friendsItems}>
                    {authData.friends.totalFriendsCount !== 0 &&
                      !isFriendsAdvanced && (
                        <div>
                          {authData.friends.confirmedFriends?.map(
                            (e: IProfileConfirmedFriend, i: number) => {
                              return (
                                <div key={i}>
                                  {i <= 2 && (
                                    <Link href={`/profile/${e.id}`}>
                                      <a target="_blank">
                                        <div
                                          className={
                                            s.infoMemberItem +
                                            " " +
                                            s.infoMemberItem_margin_20px0
                                          }
                                        >
                                          {e.avatar ? (
                                            <Image
                                              width="75px"
                                              height="75px"
                                              className={s.infoMemberItem__ava}
                                              src={e.avatar}
                                              alt="CatTalk ava"
                                            />
                                          ) : (
                                            <Avatar
                                              {...stringAvatar(
                                                e.name + " " + e.surname
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

                                          <div
                                            className={s.infoMemberItem__text}
                                          >
                                            <span
                                              className={s.infoMemberItem__name}
                                            >
                                              {e.name}
                                            </span>
                                            <br />
                                            <span
                                              className={
                                                s.infoMemberItem__surname
                                              }
                                            >
                                              {e.surname}
                                            </span>
                                          </div>
                                        </div>
                                      </a>
                                    </Link>
                                  )}
                                </div>
                              );
                            }
                          )}

                          {authData.friends.confirmedFriends?.length > 3 && (
                            <div
                              className={s.showAndHide}
                              onClick={() => {
                                setFriendsAdvanced(true);
                              }}
                            >
                              Show{" "}
                              {authData.friends.confirmedFriends.length - 3}{" "}
                              more
                            </div>
                          )}
                        </div>
                      )}

                    {authData.friends.totalFriendsCount !== 0 &&
                      isFriendsAdvanced && (
                        <div>
                          {authData.friends.confirmedFriends.map(
                            (e: IProfileConfirmedFriend, i: number) => {
                              return (
                                <div key={i}>
                                  <Link href={`/profile/${e.id}`}>
                                    <a target="_blank">
                                      <div
                                        className={
                                          s.infoMemberItem +
                                          " " +
                                          s.infoMemberItem_margin_20px0
                                        }
                                      >
                                        {e.avatar ? (
                                          <Image
                                            width="75px"
                                            height="75px"
                                            className={s.infoMemberItem__ava}
                                            src={e.avatar}
                                            alt="CatTalk ava"
                                          />
                                        ) : (
                                          <Avatar
                                            {...stringAvatar(
                                              e.name + " " + e.surname
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
                                            {e.name}
                                          </span>
                                          <br />
                                          <span
                                            className={
                                              s.infoMemberItem__surname
                                            }
                                          >
                                            {e.surname}
                                          </span>
                                        </div>
                                      </div>
                                    </a>
                                  </Link>
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

                    {authData.friends.totalFriendsCount === 0 && (
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
                          {t("no_friends1")}
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
};

const Pro2file: React.FC = () => {
  const isAuthed = useAppSelector((state) => state.sign.isAuthed);
  const isAuthFulfilled = useAppSelector((state) => state.sign.isAuthFulfilled);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthed && isAuthFulfilled) {
      router.push("/signup");
    }
  }, [isAuthFulfilled, isAuthed]);

  return <Profile />;
};

export default function InitialProfile() {
  const uniKey = useAppSelector((state) => state.sign.uniKey);

  return <Pro2file key={uniKey} />;
}
