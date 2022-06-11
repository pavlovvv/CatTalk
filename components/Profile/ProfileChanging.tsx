import styled from "@emotion/styled";
import {
  Alert, Button, CircularProgress, createTheme, TextField, ThemeProvider,
  useMediaQuery
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { setProfileError, updateOwnInfo } from "../../redux/signSlice";
import s from "../../styles/profile.module.css";
import { useAppDispatch, useAppSelector } from "../../typescript/hook";
import {
  IProfileChangingProps,
  IProfileChangingSubmit
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


export default function ProfileChanging(props: IProfileChangingProps) {
  const dispatch = useAppDispatch();
  const isProfileUpdatingConfirmed = useAppSelector(
    (state) => state.sign.isProfileUpdatingConfirmed
  );
  const isPending = useAppSelector((state) => state.sign.isPending);
  const profileError = useAppSelector((state) => state.sign.profileError);

  const [isUpdatingConfirmed, setUpdatingConfirmed] = useState(false);

  useEffect(() => {
    if (isUpdatingConfirmed && !profileError && isPending === false) {
      if (isProfileUpdatingConfirmed) {
        setUpdatingConfirmed(false);
        props.setChanging(false);
      }
    }
  }, [isPending]);

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = ({
    name,
    surname,
    username,
    age,
    location,
  }: IProfileChangingSubmit) => {
    dispatch(setProfileError(null));
    dispatch(
      updateOwnInfo({
        name:
          name.charAt(0).toUpperCase() +
          name.slice(1).replace(/\s+/g, "").toLowerCase(),
        surname:
          surname.charAt(0).toUpperCase() +
          surname.slice(1).replace(/\s+/g, "").toLowerCase(),
        username: username.replace(/\s+/g, "").toLowerCase(),
        age: age as number || null,
        location: location.length == 0 ? null : location,
      })
    );
    setUpdatingConfirmed(true);
  };
  const theme = createTheme({
    palette: {
      primary: {
        main: "#E9D5DA",
      },
      secondary: {
        main: "#333C83",
      },
      error: {
        main: "#FF4949",
      }
    },
  });

  const mw441px = useMediaQuery("(max-width:441px)");

  return (
    <ThemeProvider theme={theme}>
      <div>
        <div className={s.info__menu}>
          <Button variant="contained" color="secondary" sx={{ width: "100px" }}>
            INFO
          </Button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className={s.info__infoItems}>
              <span className={s.info__infoItemName}>name</span>
              <span className={s.info__infoItemValue}>
                <StyledTextField
                  id="name"
                  label="Name"
                  variant="outlined"
                  required
                  color="primary"
                  defaultValue={props.info[0].name}
                  sx={
                    mw441px
                      ? {
                          input: { color: "#E9D5DA" },
                          marginTop: "15px",
                          width: "100%",
                        }
                      : {
                          input: { color: "#E9D5DA" },
                        } //DADDFC
                  }
                  error={!!errors.name}
                  helperText={errors.name && errors.name.message}
                  {...register("name", {
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
              </span>
            </div>

            <hr className={s.hrUnder} />

            <div className={s.info__infoItems}>
              <span className={s.info__infoItemName}>surname</span>
              <span className={s.info__infoItemValue}>
                <StyledTextField
                  id="surname"
                  label="Surname"
                  variant="outlined"
                  required
                  error={!!errors.surname}
                  color="primary"
                  defaultValue={props.info[1].surname}
                  sx={
                    mw441px
                      ? {
                          input: { color: "#E9D5DA" },
                          marginTop: "15px",
                          width: "100%",
                        }
                      : { input: { color: "#E9D5DA" } }
                  }
                  helperText={errors.surname && errors.surname.message}
                  {...register("surname", {
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
              </span>
            </div>

            <hr className={s.hrUnder} />

            <div className={s.info__infoItems}>
              <span className={s.info__infoItemName}>username</span>
              <span className={s.info__infoItemValue}>
                <StyledTextField
                  id="username"
                  label="Username"
                  variant="outlined"
                  required
                  error={!!errors.username}
                  color="primary"
                  defaultValue={props.info[2].username}
                  sx={
                    mw441px
                      ? {
                          input: { color: "#E9D5DA" },
                          marginTop: "15px",
                          width: "100%",
                        }
                      : { input: { color: "#E9D5DA" } }
                  }
                  helperText={errors.username && errors.username.message}
                  {...register("username", {
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
                      value: /^[\w](?!.*?\.{2})[\w.]{1,28}[\w]+\s*$/,
                      message: "Use only letters of the Latin alphabet",
                    },
                  })}
                />
              </span>
            </div>

            <hr className={s.hrUnder} />

            <div className={s.info__infoItems}>
              <span className={s.info__infoItemName + " " + s.info_changedName}>
                email
              </span>
              <span
                className={s.info__infoItemValue + " " + s.info_changedValue}
              >
                {props.info[3]?.email}
              </span>
            </div>

            <hr className={s.hrUnder} />

            <div className={s.info__infoItems}>
              <span className={s.info__infoItemName + " " + s.info_changedName}>
                id
              </span>
              <span
                className={s.info__infoItemValue + " " + s.info_changedValue}
              >
                {props.info[4]?.id}
              </span>
            </div>

            <hr className={s.hrUnder} />

            <div className={s.info__infoItems}>
              <span className={s.info__infoItemName}>age</span>
              <span className={s.info__infoItemValue}>
                <StyledTextField
                  id="age"
                  label="Age"
                  variant="outlined"
                  error={!!errors.age}
                  color="primary"
                  defaultValue={props.info[5].age}
                  sx={
                    mw441px
                      ? {
                          input: { color: "#E9D5DA" },
                          marginTop: "15px",
                          width: "100%",
                        }
                      : { input: { color: "#E9D5DA" } }
                  }
                  helperText={errors.age && errors.age.message}
                  {...register("age", {
                    maxLength: {
                      value: 2,
                      message: "Maximum 2 characters",
                    },
                    pattern: {
                      value: /^[ 0-9]+$/,
                      message: "Use only numbers",
                    },
                  })}
                />
              </span>
            </div>

            <hr className={s.hrUnder} />

            <div className={s.info__infoItems}>
              <span className={s.info__infoItemName}>location</span>
              <span className={s.info__infoItemValue}>
                <StyledTextField
                  id="location"
                  label="Location"
                  variant="outlined"
                  error={!!errors.location}
                  color="primary"
                  defaultValue={props.info[6].location}
                  sx={
                    mw441px
                      ? {
                          input: { color: "#E9D5DA" },
                          marginTop: "15px",
                          width: "100%",
                        }
                      : { input: { color: "#E9D5DA" } }
                  }
                  helperText={errors.location && errors.location.message}
                  {...register("location", {
                    minLength: {
                      value: 2,
                      message: "Minimum 2 characters",
                    },
                    maxLength: {
                      value: 25,
                      message: "Maximum 25 characters",
                    },
                  })}
                />
              </span>
            </div>
            <div>
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                disabled={isPending}
                sx={{ marginLeft: "20px", marginBottom: "20px" }}
              >
                {isPending ? (
                  <CircularProgress size={30} sx={{ color: "#fff" }} />
                ) : (
                  "CONFIRM"
                )}
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="large"
                sx={{ marginLeft: "20px", marginBottom: "20px" }}
                onClick={() => {
                  props.setChanging(false);
                }}
              >
                Cancel
              </Button>
            </div>
            {profileError && (
              <Alert
                severity="error"
                variant="filled"
                sx={{
                  backgroundColor: "rgb(211, 47, 47)",
                  color: "#fff",
                }}
              >
                {profileError}
              </Alert>
            )}
          </div>
        </form>
      </div>
    </ThemeProvider>
  );
}
