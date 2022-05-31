import { useState } from "react";
import s from "../../styles/sign.module.css";
import { TextField, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { createTheme, ThemeProvider, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import DoneIcon from "@mui/icons-material/Done";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { FormHelperText, Alert } from "@mui/material";
import { Typography } from "@mui/material";
import Link from "next/link";
import { signUp } from "../../redux/signSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";

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

export default function Signup(props) {

  const dispatch = useDispatch()

  const error = useSelector(state => state.sign.error)
  const isRegConfirmed = useSelector(state => state.sign.isRegConfirmed)
  const isAuthed = useSelector(state => state.sign.isAuthed);
  const isPending = useSelector(state => state.sign.isPending);

  const router = useRouter()

  if (isAuthed) {
    router.push('/')
  }

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
      }
    },
  });

  const mw600px = useMediaQuery("(max-width:600px)");

  const [isMakenHidden, setMakenHidden] = useState(false);
  const [isHidden, setHide] = useState(false);

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

  const onContinue = () => {
      setHide(true);

      setTimeout(() => {
        setMakenHidden(true);
      }, 1000);

    
  };

  const onSubmit = ({email, password, firstName, lastName, username}) => {
    dispatch(signUp({email: email.replace(/\s+/g, '').toLowerCase(), 
      password, 
      firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(), 
      lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase(), 
      username: username.toLowerCase()}))
  };

  const password = useRef({});
  password.current = watch("password", "");

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
                    variants={isHidden && moveLeft}
                    viewport={{ amount: 0.9555 }}
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
                          value: 40,
                          message: "Maximum 40 characters",
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
                    variants={isHidden && moveRight}
                    viewport={{ amount: 0.9555 }}
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
                  </motion.div>

                  <Typography variant="body1" sx={{ fontSize: '14px', display: 'flex' }} component={'span'}>
                    Already a user? &nbsp;
                    <Link href="/login" passHref>
                      <Typography
                        variant="body1"
                        sx={{ textDecoration: "underline" , fontSize: '14px', cursor: 'pointer'}}
                        component={'span'}
                      >
                        Login
                      </Typography>
                    </Link>
                  </Typography>

                  <Button
                  type='submit'
                    variant="contained"
                    sx={{ marginTop: "15px", width: "100%" }}
                  >
                    NEXT
                  </Button>
                </form>
                {isRegConfirmed && <Alert severity="success" color="primary" variant="filled" 
                sx={{backgroundColor:'#4E9F3D', color:'#fff'}}>
                  Registration confirmed
                  </Alert>}
                {error && <Alert severity="error" color="primary" variant="filled" sx={{backgroundColor: "rgb(211, 47, 47)", color: "#fff"}}> 
                {error} 
                </Alert>}
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
                    viewport={{ amount: 0.9555 }}
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
                          value: /^[A-Za-zА-Яа-яЁё]+$/,
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
                    viewport={{ amount: 0.9555 }}
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
                      helperText={
                        errors.lastName && errors.lastName.message
                      }
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
                          value: /^[A-Za-zА-Яа-яЁё]+$/,
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
                    viewport={{ amount: 0.9555 }}
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
                          value: /^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/,
                          message:
                            "Use only letters of the Latin alphabet",
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
                    {isPending ? <CircularProgress size={30} sx={{color: "#fff"}}/> : 'SIGN UP'}
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
