import styled from "@emotion/styled";
import {
  Alert, Button, CircularProgress, createTheme, TextField, ThemeProvider,
  useMediaQuery
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { setProfileError, updateOwnInfo } from "../../redux/signSlice";
import s from "../../styles/profile.module.scss";
import { useAppDispatch, useAppSelector } from "../../typescript/hook";
import {
  IOtherTranslation,
  IProfileChangingProps,
  IProfileChangingSubmit
} from "../../typescript/interfaces/data";
import { useRouter } from "next/router";
import setTranslation from './../../other/locales/setTranslation';

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

  const {locale} = useRouter()
  
  const t: IOtherTranslation = setTranslation(locale as string)

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
            {t.info}
          </Button>
        </div>
        <form className={s.info__changeMenu} onSubmit={handleSubmit(onSubmit)}>
          <>
            <div className={s.items + ' ' + s.items_padding}>
              <span className={s.items__name}>name</span>
              <span className={s.items__value}>
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
                    required: t.filled,
                    minLength: {
                      value: 2,
                      message: t.min(2),
                    },
                    maxLength: {
                      value: 15,
                      message: t.max(15),
                    },
                    pattern: {
                      value: /^[A-Za-zА-Яа-яЁё]+\s*$/,
                      message:
                      t.r_and_l,
                    },
                  })}
                />
              </span>
            </div>

            <div className={s.items + ' ' + s.items_padding}>
              <span className={s.items__name}>surname</span>
              <span className={s.items__value}>
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
                    required: t.filled,
                    minLength: {
                      value: 2,
                      message: t.min(2),
                    },
                    maxLength: {
                      value: 15,
                      message: t.min(15),
                    },
                    pattern: {
                      value: /^[A-Za-zА-Яа-яЁё]+\s*$/,
                      message:
                      t.r_and_l,
                    },
                  })}
                />
              </span>
            </div>

            <div className={s.items + ' ' + s.items_padding}>
              <span className={s.items__name}>username</span>
              <span className={s.items__value}>
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
                    required: t.filled,
                    minLength: {
                      value: 2,
                      message: t.min(2),
                    },
                    maxLength: {
                      value: 15,
                      message: t.max(15),
                    },
                    pattern: {
                      value: /^[\w](?!.*?\.{2})[\w.]{1,28}[\w]+\s*$/,
                      message: t.latin,
                    },
                  })}
                />
              </span>
            </div>

            <div className={s.items + ' ' + s.items_padding}>
              <span className={s.items__name + " " + s.info_changedName}>
                email
              </span>
              <span
                className={s.items__value + " " + s.info_changedValue}
              >
                {props.info[3]?.email}
              </span>
            </div>

            <div className={s.items + ' ' + s.items_padding}>
              <span className={s.items__name + " " + s.info_changedName}>
                id
              </span>
              <span
                className={s.items__value + " " + s.info_changedValue}
              >
                {props.info[4]?.id}
              </span>
            </div>

            <div className={s.items + ' ' + s.items_padding}>
              <span className={s.items__name}>age</span>
              <span className={s.items__value}>
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
                      message: t.max(2),
                    },
                    pattern: {
                      value: /^[ 0-9]+$/,
                      message: t.numbers,
                    },
                  })}
                />
              </span>
            </div>

            <div className={s.items + ' ' + s.items_padding}>
              <span className={s.items__name}>location</span>
              <span className={s.items__value}>
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
                      message: t.min(2),
                    },
                    maxLength: {
                      value: 25,
                      message: t.max(25),
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
                  t.confirm
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
                {t.cancel}
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
          </>
        </form>
      </div>
    </ThemeProvider>
  );
}
