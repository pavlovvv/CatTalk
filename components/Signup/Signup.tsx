import DoneIcon from "@mui/icons-material/Done";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Button,
  CircularProgress,
  createTheme,
  FormHelperText,
  TextField,
  ThemeProvider,
  Typography,
  useMediaQuery
} from "@mui/material";
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
import anonymousIcon from "../../images/anonymous-icon.png";
import { continueWithGoogle, signAsGuest, signUp } from "../../redux/signSlice";
import s from "../../styles/sign.module.css";
import { useAppDispatch, useAppSelector } from "../../typescript/hook";
import {
  IGoogleUserData, IInputPasswordValues,
  ISignUpSubmit
} from "../../typescript/interfaces/data";

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

export default function Signup() {
  const dispatch = useAppDispatch();

  const error = useAppSelector((state) => state.sign.error);
  const isRegConfirmed = useAppSelector((state) => state.sign.isRegConfirmed);
  const isAuthed = useAppSelector((state) => state.sign.isAuthed);
  const isPending = useAppSelector((state) => state.sign.isPending);

  const router = useRouter();

  if (isAuthed) {
    router.push("/");
  }

  const [values, setValues] = useState<IInputPasswordValues>({
    password: "",
    showPassword: false,
  });

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

  const [isMakenHidden, setMakenHidden] = useState<boolean>(false);
  const [isHidden, setHide] = useState<boolean>(false);
  const [isGuestHidden, setGuestHide] = useState<boolean>(true);

  const moveLeft = {
    visible: {
      x: 0,
      opacity: 1,
    },

    hidden: {
      x: 100,
      opacity: 0,
    },
  };

  const moveRight = {
    visible: {
      x: 0,
      opacity: 1,
    },

    hidden: {
      x: -100,
      opacity: 0,
    },
  };

  const standStill = {
    visible: {
      x: 0,
      opacity: 1,
    },

    hidden: {
      x: 0,
      opacity: 1,
    },
  };

  const onContinue = () => {
    setHide(true);

    setTimeout(() => {
      setMakenHidden(true);
    }, 1000);
  };

  const onSubmit = ({
    email,
    password,
    firstName,
    lastName,
    username,
  }: ISignUpSubmit): void => {
    dispatch(
      signUp({
        email: email.replace(/\s+/g, "").toLowerCase(),
        password,
        firstName:
          firstName.charAt(0).toUpperCase() +
          firstName.slice(1).replace(/\s+/g, "").toLowerCase(),
        lastName:
          lastName.charAt(0).toUpperCase() +
          lastName.slice(1).replace(/\s+/g, "").toLowerCase(),
        username: username.replace(/\s+/g, "").toLowerCase(),
      })
    );
  };

  const password = useRef<any>({});
  password.current = watch("password", "");

  const guestPending = useAppSelector((state) => state.sign.guestPending);

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
          picture: null
        };

        sentUserData.email = userData.email;
        sentUserData.picture = userData.picture;

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

        const emailName: string[] | undefined = sentUserData.email?.split("@");
        
        dispatch(
          continueWithGoogle({
            email: sentUserData.email ? sentUserData.email.toLowerCase() : null,
            name: sentUserData.given_name
              ? sentUserData.given_name.charAt(0).toUpperCase() +
                sentUserData.given_name.slice(1).toLowerCase()
              : null,
            surname: sentUserData.family_name
              ? sentUserData.family_name.charAt(0).toUpperCase() +
                sentUserData.family_name.slice(1).toLowerCase()
              : null,
            username: emailName ? emailName[0].toLowerCase() : null,
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
    <ThemeProvider theme={theme}>
      <div className={s.signup_panel}>
        <div className={s.container}>
          <h2 className={s.singup__title}>SIGN UP</h2>

          {!isMakenHidden ? (
            <div>
              <div className={s.signup__statusbar}>
                <div
                  className={s.signup__status + " " + s.firstStage__firstStatus}
                >
                  1
                </div>
                <hr className={s.signup__hr + " " + s.firstStage__hr} />
                <div
                  className={
                    s.signup__status + " " + s.firstStage__secondStatus
                  }
                >
                  2
                </div>
              </div>

              <div className={s.signup__inputs}>
                <form
                  onSubmit={handleSubmit(onContinue)}
                  className={s.signup__inputs}
                >
                  <motion.div
                    initial="visible"
                    animate="hidden"
                    variants={isHidden ? moveLeft : standStill}
                  >
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
                  </motion.div>

                  <motion.div
                    initial="visible"
                    animate="hidden"
                    variants={isHidden ? moveRight : standStill}
                  >
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
                        required
                        {...register("password", {
                          required: "Fieled must be filled",
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
                        value={values.password}
                        onChange={handleChange("password")}
                        error={!!errors.password}
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
                  </motion.div>

                  <Typography
                    variant="body1"
                    sx={{ fontSize: "14px", display: "flex" }}
                    component={"span"}
                  >
                    Already a user? &nbsp;
                    <Link href="/login" passHref>
                      <Typography
                        variant="body1"
                        sx={{
                          textDecoration: "underline",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                        component={"span"}
                      >
                        Login
                      </Typography>
                    </Link>
                  </Typography>

                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ marginTop: "15px", width: "100%" }}
                  >
                    NEXT
                  </Button>
                </form>
                {isRegConfirmed && (
                  <Alert
                    severity="success"
                    variant="filled"
                    sx={{ backgroundColor: "#4E9F3D", color: "#fff" }}
                  >
                    Registration confirmed
                  </Alert>
                )}
                {error && (
                  <Alert
                    severity="error"
                    variant="filled"
                    sx={{ backgroundColor: "rgb(211, 47, 47)", color: "#fff" }}
                  >
                    {error}
                  </Alert>
                )}
                <div id="googleContinue" className={s.googleContinue}></div>
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
                    backgroundColor: "#202124",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#535654",
                    },
                  }}
                  onClick={() => {
                    setGuestHide(false);
                  }}
                >
                  <div className={s.sign__continueWithGoogle}>
                    <div className={s.sign__continueWithGoogleIcon}>
                      <StartAnonymousIcon />
                    </div>{" "}
                    Continue as guest
                  </div>
                </Button>
                {!isGuestHidden && (
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
              </div>
            </div>
          ) : (
            <div>
              <div className={s.signup__statusbar}>
                <div
                  className={
                    s.signup__status + " " + s.secondStage__firstStatus
                  }
                >
                  <DoneIcon />
                </div>
                <hr className={s.signup__hr + " " + s.secondStage__hr} />
                <div
                  className={
                    s.signup__status + " " + s.secondStage__secondStatus
                  }
                >
                  2
                </div>
              </div>

              <div className={s.signup__inputs}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className={s.signup__inputs}
                >
                  <TextField
                    id="filled-basic"
                    label="Filled"
                    variant="filled"
                    sx={{ display: "none" }}
                  />

                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={moveLeft}
                  >
                    <StyledTextField
                      id="name"
                      label="Name"
                      variant="standard"
                      sx={
                        mw600px
                          ? { width: "100%", input: { color: "#fff" } }
                          : { width: "400px", input: { color: "#fff" } }
                      }
                      required
                      error={!!errors.firstName}
                      helperText={errors.firstName && errors.firstName.message}
                      {...register("firstName", {
                        required: "Fieled must be filled",
                        minLength: {
                          value: 2,
                          message: "Minimum 2 characters",
                        },
                        maxLength: {
                          value: 15,
                          message: "Maximum 15 characters",
                        },
                        pattern: {
                          value: /^[A-Za-zА-Яа-яЁё]+\s*$/,
                          message:
                            "Use only letters of the Russian and Latin alphabets",
                        },
                      })}
                    />
                  </motion.div>

                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={moveRight}
                  >
                    <StyledTextField
                      id="surname"
                      label="Surname"
                      variant="standard"
                      sx={
                        mw600px
                          ? { width: "100%", input: { color: "#fff" } }
                          : { width: "400px", input: { color: "#fff" } }
                      }
                      required
                      error={!!errors.lastName}
                      helperText={errors.lastName && errors.lastName.message}
                      {...register("lastName", {
                        required: "Fieled must be filled",
                        minLength: {
                          value: 2,
                          message: "Minimum 2 characters",
                        },
                        maxLength: {
                          value: 15,
                          message: "Maximum 15 characters",
                        },
                        pattern: {
                          value: /^[A-Za-zА-Яа-яЁё]+\s*$/,
                          message:
                            "Use only letters of the Russian and Latin alphabets",
                        },
                      })}
                    />
                  </motion.div>

                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={moveLeft}
                  >
                    <StyledTextField
                      id="username"
                      label="Username"
                      variant="standard"
                      sx={
                        mw600px
                          ? { width: "100%", input: { color: "#fff" } }
                          : { width: "400px", input: { color: "#fff" } }
                      }
                      required
                      error={!!errors.username}
                      helperText={errors.username && errors.username.message}
                      {...register("username", {
                        required: "Fieled must be filled",
                        minLength: {
                          value: 3,
                          message: "Minimum 3 characters",
                        },
                        maxLength: {
                          value: 14,
                          message: "Maximum 14 characters",
                        },
                        pattern: {
                          value: /^[\w](?!.*?\.{2})[\w.]{1,28}[\w]+\s*$/,
                          message:
                            "Use only letters of the Latin alphabet and numbers",
                        },
                      })}
                    />
                  </motion.div>

                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ marginTop: "30px", width: "100%" }}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <CircularProgress size={30} sx={{ color: "#fff" }} />
                    ) : (
                      "SIGN UP"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}
