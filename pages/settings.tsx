import styled from "@emotion/styled";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import {
  Alert,
  Button,
  CircularProgress,
  createTheme,
  TextField,
  ThemeProvider,
  useMediaQuery
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import MainLayout from "../components/MainLayout";
import {
  deleteAvatar,
  updateAvatar,
  updatePersonalData,
  updateSecurityData
} from "../redux/settingsSlice";
import s from "../styles/settings.module.scss";
import { useAppDispatch, useAppSelector } from "../typescript/hook";
import { ILocale, ILoginSubmit, IPersonalSubmit } from "../typescript/interfaces/data";
import discordIcon from "/images/discord-icon.svg";
import instagramIcon from "/images/Instagram_icon.png";
import telegramIcon from "/images/Telegram_icon.png";

export async function getStaticProps({ locale }: ILocale) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "settings"])),
    },
  };
}

const StyledTextField = styled(TextField)({
  "& label": {
    color: "#fff",
  },
  "& label.Mui-focused": {
    color: "#fff",
  },
  "&:hover .MuiInput-underline:hover:before": {
    borderBottomColor: "#fff",
  },
  "&:hover .MuiInput-underline:hover:after": {
    borderBottomColor: "#fff",
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: "#fff",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#fff",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#fff",
    },
    "&:hover fieldset": {
      borderColor: "#fff",
      borderWidth: 2,
    },
    "&.Mui-focused fieldset": {
      borderColor: "#fff",
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

const Settings: React.FC = () => {
  const authData = useAppSelector((state) => state.sign.userData);

  const isSecurityDataChangingPending = useAppSelector(
    (state) => state.settings.isSecurityDataChangingPending
  );
  const isSecurityDataChangingConfirmed = useAppSelector(
    (state) => state.settings.isSecurityDataChangingConfirmed
  );
  const securityDataChangingError = useAppSelector(
    (state) => state.settings.securityDataChangingError
  );
  const isPersonalDataChangingPending = useAppSelector(
    (state) => state.settings.isPersonalDataChangingPending
  );
  const isPersonalDataChangingConfirmed = useAppSelector(
    (state) => state.settings.isPersonalDataChangingConfirmed
  );
  const personalDataChangingError = useAppSelector(
    (state) => state.settings.personalDataChangingError
  );
  const isAvatarChangingPending = useAppSelector(
    (state) => state.settings.isAvatarChangingPending
  );
  const isAvatarChangingConfirmed = useAppSelector(
    (state) => state.settings.isAvatarChangingConfirmed
  );
  const avatarChangingError = useAppSelector(
    (state) => state.settings.avatarChangingError
  );

  const { t } = useTranslation("settings");
  const ct = useTranslation("common").t;

  const {
    register,
    watch,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onBlur",
  });

  const theme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      secondary: {
        main: "#fff",
      },
    },
  });

  const dispatch = useAppDispatch();

  const mw599px = useMediaQuery("(max-width:599px)");

  const onSecuritySubmit = ({ email, password }: ILoginSubmit): void => {
    dispatch(
      updateSecurityData({
        email,
        password: password || null,
      })
    );
  };

  const onPersonalSubmit = ({
    instagramLink,
    telegramUsername,
    discordUsername,
  }: IPersonalSubmit): void => {
    dispatch(
      updatePersonalData({
        instagramLink: instagramLink || null,
        telegramUsername: telegramUsername || null,
        discordUsername: discordUsername || null,
      })
    );
  };

  const onImageSubmit = (e: any): void => {
    dispatch(
      updateAvatar({
        file: e.target.files[0],
      })
    );
  };

  return (
    <MainLayout>
      <ThemeProvider theme={theme}>
        <div className={s.settingsPage}>
          <div className={s.settingsPanel}>
            <div className={s.container}>
              <div className={s.settingsPanel__inner}>
                <section className={s.settingsPanel__security}>
                  <h2 className={s.settingsPanelTitle}>{t("security")}</h2>
                  <form
                    onSubmit={handleSubmit(onSecuritySubmit)}
                    className={s.settingsPanel__securityElements}
                  >
                    <div
                      className={s.settingsPanel__securityElement}
                      style={
                        authData.type === "defaultUser"
                          ? {}
                          : { display: "none" }
                      }
                    >
                      <div>
                        <StyledTextField
                          id="email"
                          label={t("new_email")}
                          variant="outlined"
                          required
                          error={!!errors.email}
                          color="primary"
                          defaultValue={authData.info[3]?.email}
                          sx={{
                            input: { color: "#fff" },
                            minWidth: "220px",
                            width: "100%",
                          }}
                          helperText={errors.email && errors.email.message}
                          {...register("email", {
                            required: ct("filled"),
                            minLength: {
                              value: 2,
                              message: ct("min", { count: 2 }),
                            },
                            maxLength: {
                              value: 25,
                              message: ct("max", { count: 25 }),
                            },
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+\s*$/i,
                              message: ct("invaild_email"),
                            },
                          })}
                        />
                      </div>
                    </div>
                    <div className={s.settingsPanel__securityElement}>
                      <div>
                        <StyledTextField
                          id="password"
                          label={t("new_password")}
                          variant="outlined"
                          error={!!errors.password}
                          color="primary"
                          sx={{ input: { color: "#fff" }, width: "100%" }}
                          helperText={
                            errors.password && errors.password.message
                          }
                          {...register("password", {
                            minLength: {
                              value: 8,
                              message: ct("min", { count: 8 }),
                            },
                            maxLength: {
                              value: 25,
                              message: ct("max", { count: 25 }),
                            },
                          })}
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      size="large"
                      disabled={isSecurityDataChangingPending}
                    >
                      {isSecurityDataChangingPending ? (
                        <CircularProgress size={30} sx={{ color: "#fff" }} />
                      ) : (
                        ct("confirm")
                      )}
                    </Button>

                    {isSecurityDataChangingConfirmed && (
                      <Alert
                        severity="success"
                        variant="filled"
                        sx={{ backgroundColor: "#4E9F3D", color: "#fff" }}
                      >
                        {t("update_confirmed")}
                      </Alert>
                    )}
                    {securityDataChangingError && (
                      <Alert
                        severity="error"
                        variant="filled"
                        sx={{
                          backgroundColor: "rgb(211, 47, 47)",
                          color: "#fff",
                        }}
                      >
                        {securityDataChangingError}
                      </Alert>
                    )}
                  </form>
                </section>

                <section className={s.settingsPanel__personal}>
                  <h2 className={s.settingsPanelTitle}>{t("personal")}</h2>
                  <form
                    onSubmit={handleSubmit(onPersonalSubmit)}
                    className={s.settingsPanel__personalElements}
                  >
                    <div className={s.settingsPanel__personalElement}>
                      <span style={{ fontSize: "18px" }}>{t("avatar")}: </span>
                      <div>
                        <Button
                          variant="outlined"
                          size="large"
                          color="secondary"
                          component="label"
                          disabled={isAvatarChangingPending}
                        >
                          {isAvatarChangingPending ? (
                            <CircularProgress
                              size={30}
                              sx={{ color: "#fff" }}
                            />
                          ) : (
                            t("upload_file")
                          )}
                          <input
                            type="file"
                            onChange={onImageSubmit}
                            hidden
                            accept="image/png, image/jpeg"
                          />
                        </Button>
                      </div>
                    </div>
                    {authData.info[7]?.avatar ? (
                      <div className={s.settingsPanel__personalElement}>
                        <Image
                          width="50px"
                          height="50px"
                          style={{ borderRadius: "50%" }}
                          src={authData.info[7].avatar}
                          alt="content__img"
                        />
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<NoAccountsIcon />}
                          size="large"
                          onClick={() => {
                            dispatch(deleteAvatar());
                          }}
                          disabled={isAvatarChangingPending}
                        >
                          {isAvatarChangingPending ? (
                            <CircularProgress
                              size={30}
                              sx={{ color: "#fff" }}
                            />
                          ) : (
                            t("delete_avatar")
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Alert
                        severity="warning"
                        variant="filled"
                        sx={{
                          backgroundColor: "rgb(245, 124, 0)",
                          color: "#fff",
                        }}
                      >
                        <div
                          className={
                            s.settingsPanel__personalElementWidthRecommendation
                          }
                        >
                          {t("width_recommendation")}
                        </div>
                      </Alert>
                    )}

                    {isAvatarChangingConfirmed && (
                      <Alert
                        severity="success"
                        variant="filled"
                        sx={{ backgroundColor: "#4E9F3D", color: "#fff" }}
                      >
                        {t("update_confirmed")}
                      </Alert>
                    )}
                    {avatarChangingError && (
                      <Alert
                        severity="error"
                        variant="filled"
                        sx={{
                          backgroundColor: "rgb(211, 47, 47)",
                          color: "#fff",
                        }}
                      >
                        {avatarChangingError}
                      </Alert>
                    )}
                    <div className={s.settingsPanel__personalElement}>
                      <div>
                        <Image
                          src={"/" + instagramIcon.src}
                          width="50px"
                          height="50px"
                          alt="instagramIcon"
                        />
                      </div>
                      <div>
                        <StyledTextField
                          id="instagramLink"
                          label="https://www.instagram.com/"
                          variant="outlined"
                          error={!!errors.instagramLink}
                          color="primary"
                          defaultValue={authData.info[8]?.instagramLink}
                          sx={
                            !mw599px
                              ? {
                                  input: { color: "#fff" },
                                  minWidth: "350px",
                                  width: "100%",
                                }
                              : { input: { color: "#fff" }, width: "100%" }
                          }
                          helperText={
                            errors.instagramLink && errors.instagramLink.message
                          }
                          {...register("instagramLink", {
                            minLength: {
                              value: 10,
                              message: ct("min", { count: 10 }),
                            },
                            pattern: {
                              value:
                                /(?:(?:http|https):\/\/)?(?:www\.)?(?:instagram\.com)\/([A-Za-z0-9-_\.]+)/im,
                              message: t("not_instagram_link"),
                            },
                          })}
                        />
                      </div>
                    </div>

                    <div className={s.settingsPanel__personalElement}>
                      <div>
                        <Image
                          src={"/" + telegramIcon.src}
                          width="50px"
                          height="50px"
                          alt="telegramIcon"
                        />
                      </div>
                      <div>
                        <StyledTextField
                          id="telegramUsername"
                          label="@"
                          variant="outlined"
                          error={!!errors.telegramUsername}
                          color="primary"
                          defaultValue={authData.info[9]?.telegramUsername}
                          sx={
                            !mw599px
                              ? {
                                  input: { color: "#fff" },
                                  minWidth: "350px",
                                  width: "100%",
                                }
                              : { input: { color: "#fff" }, width: "100%" }
                          }
                          helperText={
                            errors.telegramUsername &&
                            errors.telegramUsername.message
                          }
                          {...register("telegramUsername", {
                            minLength: {
                              value: 3,
                              message: ct("min", { count: 3 }),
                            },
                            pattern: {
                              // value: /@+[a-z]+$/,
                              value:
                                /.*\B@(?=\w{5,32}\b)[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*.*/,
                              message: t("not_telegram_account"),
                            },
                          })}
                        />
                      </div>
                    </div>

                    <div className={s.settingsPanel__personalElement}>
                      <div>
                        <Image
                          src={"/" + discordIcon.src}
                          width="50px"
                          height="50px"
                          alt="discordIcon"
                        />
                      </div>
                      <div>
                        <StyledTextField
                          id="discord username"
                          label="name#0000"
                          variant="outlined"
                          error={!!errors.discordUsername}
                          color="primary"
                          defaultValue={authData.info[10]?.discordUsername}
                          sx={
                            !mw599px
                              ? {
                                  input: { color: "#fff" },
                                  minWidth: "350px",
                                  width: "100%",
                                }
                              : { input: { color: "#fff" }, width: "100%" }
                          }
                          helperText={
                            errors.discordUsername &&
                            errors.discordUsername.message
                          }
                          {...register("discordUsername", {
                            minLength: {
                              value: 6,
                              message: ct("min", { count: 6 }),
                            },
                            pattern: {
                              value: /^((.+?)#\d{4})/,
                              message: t("not_discord_account"),
                            },
                          })}
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      size="large"
                      disabled={isPersonalDataChangingPending}
                    >
                      {isPersonalDataChangingPending ? (
                        <CircularProgress size={30} sx={{ color: "#fff" }} />
                      ) : (
                        ct("confirm")
                      )}
                    </Button>

                    {isPersonalDataChangingConfirmed && (
                      <Alert
                        severity="success"
                        variant="filled"
                        sx={{ backgroundColor: "#4E9F3D", color: "#fff" }}
                      >
                        {t("update_confirmed")}
                      </Alert>
                    )}
                    {personalDataChangingError && (
                      <Alert
                        severity="error"
                        variant="filled"
                        sx={{
                          backgroundColor: "rgb(211, 47, 47)",
                          color: "#fff",
                        }}
                      >
                        {personalDataChangingError}
                      </Alert>
                    )}
                  </form>
                </section>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </MainLayout>
  );
};

export default function InitialSettings() {
  const isAuthed = useAppSelector((state) => state.sign.isAuthed);
  const isAuthFulfilled = useAppSelector((state) => state.sign.isAuthFulfilled);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthed && isAuthFulfilled) {
      router.push("/signup");
    }
  }, [isAuthFulfilled, isAuthed]);

  return <Settings key={!isAuthed ? 0 : 1} />;
}
