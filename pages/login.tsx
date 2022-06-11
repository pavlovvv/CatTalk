import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Alert, Button, CircularProgress, createTheme, FormHelperText, TextField, ThemeProvider, Typography, useMediaQuery } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import { styled } from "@mui/material/styles";
import cyrillicToTranslit from "cyrillic-to-translit-js";
import { motion } from "framer-motion";
import jwtDecode from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import MainLayout from "../components/MainLayout";
import anonymousIcon from "../images/anonymous-icon.png";
import { auth, continueWithGoogle, signAsGuest } from "../redux/signSlice";
import s from "../styles/sign.module.css";
import { useAppDispatch, useAppSelector } from "../typescript/hook";
import {
  IGoogleUserData,
  IInputPasswordValues,
  ILoginSubmit
} from "../typescript/interfaces/data";

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

const StyledInput = styled(Input)({
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

declare const window: any;

const Login: React.FC = () => {
  const [values, setValues] = useState<IInputPasswordValues>({
    password: "",
    showPassword: false,
  });

  const [isHidden, setHide] = useState<boolean>(true);

  const {
    register,
    watch,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    mode: "onBlur",
  });

  const handleChange =
    (prop: keyof IInputPasswordValues) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setValues({ ...values, [prop]: event.target.value });
      setValue(prop, event.target.value);
    };

  const handleClickShowPassword = (): void => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      error: {
        main: "#FF5959",
      },
    },
  });

  const mw600px = useMediaQuery("(max-width:600px)");

  const dispatch = useAppDispatch();

  const logInError = useAppSelector((state) => state.sign.logInError);

  const onSubmit = ({ email, password }: ILoginSubmit): void => {
    dispatch(auth({ email: email.replace(/\s+/g, ""), password }));
  };

  const password = useRef<any>({});
  password.current = watch("password", "");

  const isPending = useAppSelector((state) => state.sign.isPending);
  const guestPending = useAppSelector((state) => state.sign.guestPending);
  const error = useAppSelector((state) => state.sign.error);

  const StartAnonymousIcon = (): ReactElement => {
    return (
      <Image
        src={"/" + anonymousIcon.src}
        alt="Anonymous_icon"
        width="40px"
        height="40px"
      />
    );
  };

  const moveBottom = {
    visible: {
      y: 0,
      opacity: 1,
    },

    hidden: {
      y: -100,
      opacity: 0,
    },
  };

  useEffect(() => {
    /* global google */

    window.google.accounts.id.initialize({
      client_id:
        "1001738861489-2ruued10d8gdg70jd9k73abfh0gll8il.apps.googleusercontent.com",
      callback: (response: any) => {
        const userData: IGoogleUserData = jwtDecode(response.credential);
        const sentUserData: IGoogleUserData = {
          email: null,
          given_name: null,
          family_name: null,
          picture: null,
          name: null,
        };

        sentUserData.email = userData.email;
        sentUserData.picture = userData.picture;

        if (userData.name) {
          //ts
          sentUserData.name = cyrillicToTranslit().transform(
            userData.name,
            "_"
          );
        }

        if (userData.family_name && userData.given_name) {
          sentUserData.family_name = cyrillicToTranslit().transform(
            userData.family_name,
            "_"
          );
          sentUserData.given_name = cyrillicToTranslit().transform(
            userData.given_name,
            "_"
          );
        } else {
          if (userData.given_name) {
            sentUserData.family_name = cyrillicToTranslit().transform(
              userData.given_name,
              "_"
            );
            sentUserData.given_name = cyrillicToTranslit().transform(
              userData.given_name,
              "_"
            );
          }
        }

        dispatch(
          continueWithGoogle({
            email: sentUserData.email,
            name: sentUserData.given_name,
            surname: sentUserData.family_name,
            username: sentUserData.name,
          })
        );
      },
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleContinue"),
      {
        theme: "filled_black",
        size: "large",
        text: "continue_with",
        logo_alignment: "left",
        locale: "en",
        type: "standard",
        width: "100",
      }
    );
  }, []);

  return (
    <MainLayout>
      <ThemeProvider theme={theme}>
        <div className={s.loginpage}>
          <div className={s.signup_panel}>
            <div className={s.container}>
              <h2 className={s.singup__title}>LOG IN</h2>

              <div>
                <div className={s.signup__inputs}>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={s.signup__inputs}
                  >
                    <div>
                      <StyledTextField
                        id="email"
                        label="Email"
                        variant="standard"
                        sx={
                          mw600px
                            ? { width: "100%", input: { color: "#fff" } }
                            : { width: "400px", input: { color: "#fff" } }
                        }
                        required
                        error={!!errors.email}
                        helperText={errors.email && errors.email.message}
                        {...register("email", {
                          required: "Field must be filled",
                          minLength: {
                            value: 8,
                            message: "Minimum 8 characters",
                          },
                          maxLength: {
                            value: 35,
                            message: "Maximum 35 characters",
                          },
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+\s*$/i,
                            message: "Invalid email",
                          },
                        })}
                      />
                    </div>

                    <div>
                      <FormControl
                        sx={mw600px ? { width: "100%" } : { width: "400px" }}
                        variant="standard"
                        required
                        error={!!errors.password}
                      >
                        <InputLabel color="primary" sx={{ color: "#fff" }}>
                          Password
                        </InputLabel>
                        <StyledInput
                          {...register("password", {
                            // required: "Field must be filled",
                            minLength: {
                              value: 8,
                              message: "Minimum 8 characters",
                            },
                            maxLength: {
                              value: 25,
                              message: "Maximum 25 characters",
                            },
                          })}
                          id="password"
                          type={values.showPassword ? "text" : "password"}
                          // value={values.password}
                          onChange={handleChange("password")}
                          // inputRef={password}
                          sx={{
                            "&:after": {
                              borderBottom: "2px solid #fff !important",
                            },
                            "&:before": {
                              borderBottom: "1px solid #fff !important",
                            },
                            "&:after:hover": {
                              borderBottom: "border-bottom: none!important",
                            },

                            input: { color: "#fff" },
                          }}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                sx={{ color: "#fff" }}
                              >
                                {values.showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                        <FormHelperText color="error" sx={{ color: "#FF5959" }}>
                          {errors.password && errors.password.message}
                        </FormHelperText>
                      </FormControl>
                    </div>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: "14px", display: "flex" }}
                      component={"span"}
                    >
                      New here? &nbsp;
                      <Link href="/signup" passHref>
                        <Typography
                          variant="body1"
                          sx={{
                            textDecoration: "underline",
                            fontSize: "14px",
                            cursor: "pointer",
                          }}
                          component={"span"}
                        >
                          Sign up
                        </Typography>
                      </Link>
                    </Typography>

                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ marginTop: "20px", width: "100%" }}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <CircularProgress size={30} sx={{ color: "#fff" }} />
                      ) : (
                        "LOG IN"
                      )}
                    </Button>
                  </form>
                  {logInError && (
                    <Alert
                      severity="error"
                      variant="filled"
                      sx={{
                        backgroundColor: "rgb(211, 47, 47)",
                        color: "#fff",
                      }}
                    >
                      {logInError}
                    </Alert>
                  )}

                  <div
                    id="googleContinue"
                    style={{ marginTop: "20px" }}
                    className={s.googleContinue}
                  ></div>
                  <Button
                    variant="contained"
                    sx={{
                      width: "100%",
                      textTransform: "none",
                      fontWeight: "500",
                      fontFamily: "Open Sans",
                      fontSize: "14px",
                      letterSpacing: "0.25px",
                      height: "60px",
                      color: "#fff",
                      backgroundColor: "#202124",
                      "&:hover": {
                        backgroundColor: "#535654",
                      },
                    }}
                    onClick={() => {
                      setHide(false);
                    }}
                  >
                    <div className={s.sign__continueWithGoogle}>
                      <div className={s.sign__continueWithGoogleIcon}>
                        <StartAnonymousIcon />
                      </div>{" "}
                      Continue as guest
                    </div>
                  </Button>
                  {!isHidden && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={moveBottom}
                    >
                      <Alert
                        severity="warning"
                        variant="filled"
                        sx={{
                          backgroundColor: "rgb(245, 124, 0)",
                          color: "#fff",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: "20px",
                          }}
                        >
                          All guests delete every day at 3:30 AM
                          <Button
                            variant="contained"
                            sx={{
                              lineHeight: "20px",
                              backgroundColor: "#333C83",
                              color: "#fff",
                              "&:hover": {
                                backgroundColor: "#333C83",
                              },
                            }}
                            onClick={() => {
                              dispatch(signAsGuest());
                            }}
                            disabled={guestPending}
                          >
                            {guestPending ? (
                              <>
                                <CircularProgress
                                  size={20}
                                  sx={{ color: "#fff" }}
                                />{" "}
                                <span
                                  style={{ marginLeft: "10px", color: "#fff" }}
                                >
                                  got it
                                </span>
                              </>
                            ) : (
                              "got it"
                            )}
                          </Button>
                        </div>
                      </Alert>
                    </motion.div>
                  )}
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
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </MainLayout>
  );
};

export default function InitialLogin() {
  const key = useAppSelector((state) => state.sign.key);
  const isAuthed = useAppSelector((state) => state.sign.isAuthed);

  const router = useRouter();

  if (isAuthed) {
    router.push("/");
  }

  return <Login key={key} />;
}
