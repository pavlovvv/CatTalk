import MainLayout from "../components/MainLayout.jsx";
import s from "../styles/token.module.css";
import { TextField, Button, Alert } from "@mui/material";
import { createTheme, ThemeProvider, CircularProgress , Popover, Typography} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { getToken, findToken, setFoundToken } from "../redux/tokenSlice.js";




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



function TokenPage() {


  const theme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      third: {
        main: '#000000'
      },
      error: {
        main: "#FF5959",
      },
    },
  });

  const {
    register,
    watch,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onBlur",
  });

  const dispatch = useDispatch();
  const router = useRouter()




  const isGetPending = useSelector((state) => state.token.isGetPending);
  const isFindPending = useSelector((state) => state.token.isFindPending);
  const token = useSelector((state) => state.token.token);
  const foundToken = useSelector((state) => state.token.foundToken);
  const error = useSelector((state) => state.token.error);

  const [anchorEl, setAnchorEl] = useState(null);
  const [isCopied, setCopy] = useState(false)

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const onSubmit = e => {
    dispatch(findToken({token: e.token}))
  };

useEffect(() => {
  if (foundToken) {
    router.push(`/chat/join/${foundToken}`)
    dispatch(setFoundToken({token: null}))
  }
}, [foundToken])



  return (
    <MainLayout>
      <ThemeProvider theme={theme}>
        <div className={s.tokenPage}>
          <div className={s.tokenPage__panel}>
            <div className={s.container}>
              <section>
                <h2 className={s.tokenPage__title}>ENTER TOKEN</h2>
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
                          required: "Field must be filled",
                          minLength: {
                            value: 5,
                            message: "Minimum 5 characters",
                          }
                        })}
                      />

                      <Button
                      type='submit'
                        variant="contained"
                        sx={{ marginTop: "20px", width: "100%" }}
                        disabled={isFindPending}
                      >
                        {isFindPending ? <CircularProgress size={30} sx={{ color: "#000000" }} /> : 'ENTER'}
                      </Button>
                    </div>
                  </form>
                  {error && (
                    <Alert
                      severity="error"
                      color="primary"
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
                  color='third'
                  sx={{ marginTop: "30px", marginBottom: '25px', width: "100%", lineHeight: '40px' }}
                  disabled={isGetPending}
                  onClick={() => {
                    if (!token) {
                      dispatch(getToken())
                    }
                  }}
                >
                  {isGetPending && <CircularProgress size={30} sx={{ color: "#fff" }} />}
                  {token && 'YOUR TOKEN IS:'}
                  {!isGetPending && !token && 'GET TOKEN'}
                </Button>
                {token && (
                  <div>
                    <Alert
                      severity="success"
                      color="primary"
                      variant="filled"
                      onClick={() => { 
                        setCopy(true)
                        navigator.clipboard.writeText(token) 
                      }}
                      sx={{
                        backgroundColor: "#4E9F3D",
                        color: "#fff",
                        cursor: 'pointer'
                      }}
                      onMouseEnter={handlePopoverOpen}
                      onMouseLeave={handlePopoverClose}
                    >
                      {token}
                    </Alert>
                    <Popover
                      id="mouse-over-popover"
                      sx={{
                        pointerEvents: 'none',
                      }}
                      open={open}
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      onClose={handlePopoverClose}
                      disableRestoreFocus
                    >
                      
                      <Typography sx={{ p: 1 }}>{!isCopied ? 'Click to copy' : 'Copied!'}</Typography>
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
}

export default function InititalTokenPage(props) {
  const isAuthed = useSelector((state) => state.sign.isAuthed);
  const isAuthFulfilled = useSelector(state => state.sign.isAuthFulfilled)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthed && isAuthFulfilled) {

      router.push('/signup')

    }
  }, [isAuthFulfilled])

  return (
    <TokenPage {...props} />
  )
}
