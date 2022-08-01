import {
  Alert,
  Button,
  CircularProgress,
  createTheme,
  Popover,
  TextField,
  ThemeProvider,
  Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import MainLayout from "../components/MainLayout";
import { findToken, getToken, setFoundToken } from "../redux/tokenSlice";
import s from "../styles/token.module.scss";
import { useAppDispatch, useAppSelector } from "../typescript/hook";
import { ILocale } from "../typescript/interfaces/data";
import { ITokenSubmit } from "./../typescript/interfaces/data";

export async function getStaticProps({ locale }: ILocale) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "token"])),
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

const TokenPage: React.FC = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      secondary: {
        main: "#000000",
      },
      error: {
        main: "#FF5959",
      },
    },
  });

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onBlur",
  });

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation("token");
  const ct = useTranslation("common").t;

  const isGetPending = useAppSelector((state) => state.token.isGetPending);
  const isFindPending = useAppSelector((state) => state.token.isFindPending);
  const token = useAppSelector((state) => state.token.token);
  const foundToken = useAppSelector((state) => state.token.foundToken);
  const error = useAppSelector((state) => state.token.error);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isCopied, setCopy] = useState<boolean>(false);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = (): void => {
    setAnchorEl(null);
  };

  const open: boolean = Boolean(anchorEl);

  const onSubmit = (e: ITokenSubmit): void => {
    dispatch(findToken({ token: e.token }));
  };

  useEffect(() => {
    if (foundToken) {
      router.push(`/chat/join/${foundToken}`);
      dispatch(setFoundToken(null));
    }
  }, [foundToken]);

  return (
    <MainLayout>
      <ThemeProvider theme={theme}>
        <div className={s.tokenPage}>
          <div className={s.tokenPage__panel}>
            <div className={s.container}>
              <section>
                <h2 className={s.tokenPage__title}>{t("enter_token")}</h2>
                <div className={s.tokenPage__elements}>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={s.tokenPage__elements}
                  >
                    <div>
                      <StyledTextField
                        id="Token"
                        label="Token"
                        variant="outlined"
                        sx={{ width: "100%", input: { color: "#fff" } }}
                        required
                        error={!!errors.token}
                        helperText={errors.token && errors.token.message}
                        {...register("token", {
                          required: ct("filled"),
                          minLength: {
                            value: 5,
                            message: ct("min", { count: 5 }),
                          },
                        })}
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        sx={{ marginTop: "20px", width: "100%" }}
                        disabled={isFindPending}
                      >
                        {isFindPending ? (
                          <CircularProgress size={30} sx={{ color: "#fff" }} />
                        ) : (
                          <>{t("enter")}</>
                        )}
                      </Button>
                    </div>
                  </form>
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
                </div>
              </section>

              <section>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    marginTop: "30px",
                    marginBottom: "25px",
                    width: "100%",
                    lineHeight: "40px",
                  }}
                  disabled={isGetPending}
                  onClick={() => {
                    if (!token) {
                      dispatch(getToken());
                    }
                  }}
                >
                  {isGetPending && (
                    <CircularProgress size={30} sx={{ color: "#fff" }} />
                  )}
                  {token && <>{t("your_token")}</>}
                  {!isGetPending && !token && <>{t("get_token")}</>}
                </Button>
                {token && (
                  <div>
                    <Alert
                      severity="success"
                      variant="filled"
                      onClick={() => {
                        setCopy(true);
                        navigator.clipboard.writeText(token);
                      }}
                      sx={{
                        backgroundColor: "#4E9F3D",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                      onMouseEnter={handlePopoverOpen}
                      onMouseLeave={handlePopoverClose}
                    >
                      {token}
                    </Alert>
                    <Popover
                      id="mouse-over-popover"
                      sx={{
                        pointerEvents: "none",
                      }}
                      open={open}
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: "center",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      onClose={handlePopoverClose}
                      disableRestoreFocus
                    >
                      <Typography sx={{ p: 1 }}>
                        {!isCopied ? (
                          <>{t("click_to_copy")}</>
                        ) : (
                          <>{t("copied")}</>
                        )}
                      </Typography>
                    </Popover>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </MainLayout>
  );
};

export default function InititalTokenPage() {
  const isAuthed = useAppSelector((state) => state.sign.isAuthed);
  const isAuthFulfilled = useAppSelector((state) => state.sign.isAuthFulfilled);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthed && isAuthFulfilled) {
      router.push("/signup");
    }
  }, [isAuthFulfilled]);

  return <TokenPage />;
}
