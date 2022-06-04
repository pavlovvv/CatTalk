import MainLayout from "../components/MainLayout.jsx";
import s from "../styles/sign.module.css";
import { TextField, Button, Alert } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { createTheme, ThemeProvider, useMediaQuery, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { FormHelperText } from "@mui/material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../redux/signSlice";
import { useRouter } from "next/router";
import Link from "next/link";

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

function Login(props) {

  const [values, setValues] = useState({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });

  const {
    register,
    watch,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    setValue
  } = useForm({
    mode: "onBlur",
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    setValue(prop, event.target.value)
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
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

  const dispatch = useDispatch();

  const logInError = useSelector((state) => state.sign.logInError);

  const onSubmit = ({ email, password }) => {
    dispatch(auth({ email: email.replace(/\s+/g, ''), password }));
  };

  const password = useRef({});
  password.current = watch("password", "");

  const isPending = useSelector((state) => state.sign.isPending);

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
                                sx={{color: '#fff'}}
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
                    <Typography variant="body1" sx={{ fontSize: '14px', display: 'flex' }} component={'span'}>
                      New here? &nbsp;
                      <Link href="/signup" passHref>
                        <Typography
                          variant="body1"
                          sx={{ textDecoration: "underline", fontSize: '14px', cursor: 'pointer' }}
                          component={'span'}
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
                      {isPending ? <CircularProgress size={30} sx={{ color: "#fff" }} /> : 'LOG IN'}
                    </Button>
                  </form>
                  {logInError && (
                    <Alert
                      severity="error"
                      color="primary"
                      variant="filled"
                      sx={{
                        backgroundColor: "rgb(211, 47, 47)",
                        color: "#fff",
                      }}
                    >
                      {logInError}
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
}



export default function Log(props) {
  const key = useSelector((state) => state.sign.key);
  const isAuthed = useSelector((state) => state.sign.isAuthed);

  const router = useRouter()

  if (isAuthed) {
    router.push('/')
  }

  return (
    <Login {...props} key={key} />
  )
}
