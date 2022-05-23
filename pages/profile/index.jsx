import MainLayout from "../../components/MainLayout.jsx";
import Image from "next/image";
import s from "../../styles/profile.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, createTheme, ThemeProvider, Alert, Avatar, Popover, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import ProfileChanging from "../../components/Profile/ProfileChanging.jsx";
import SettingsIcon from '@mui/icons-material/Settings';
import Link from "next/link";
import instagramIcon from '../../images/Instagram_icon.webp'
import telegramIcon from '../../images/Telegram_icon.webp'
import discordIcon from '../../images/discord-icon.svg'


function Profile(props) {

  const stats = [
    "Total chats", "Total messages sent", "Total entered characters"
  ];

  const friends = [
    {
      name: "Antony",
      surname: "Taylor",
      img: "https://static.vecteezy.com/system/resources/previews/002/275/847/large_2x/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg?imwidth=96",
    }
  ];

  const [infoOption, setInfo] = useState("info");
  const [isChanging, setChanging] = useState(false)
  const [isFriendsAdvanced, setFriendsAdvanced] = useState(false)

  const authData = useSelector(state => state.sign.userData)

  const theme = createTheme({
    palette: {
      secondary: {
        main: "#333C83",
      },
    },
  });

  const dispatch = useDispatch()

  const isProfileUpdatingConfirmed = useSelector(state => state.sign.isProfileUpdatingConfirmed)

  const stringAvatar = name => {
    return {
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  const [anchorTelegramEl, setAnchorTelegramEl] = useState(null);
  const [anchorDiscordEl, setAnchorDiscordEl] = useState(null);
  const [isTelegramCopied, setTelegramCopy] = useState(false)
  const [isDiscordCopied, setDiscordCopy] = useState(false)

  const handlePopoverTelegramOpen = (event) => {
    setAnchorTelegramEl(event.currentTarget);
  };

  const handlePopoverTelegramClose = () => {
    setAnchorTelegramEl(null);
  };

  const handlePopoverDiscordOpen = (event) => {
    setAnchorDiscordEl(event.currentTarget);
  };

  const handlePopoverDiscordClose = () => {
    setAnchorDiscordEl(null);
  };

  const telegramOpen = Boolean(anchorTelegramEl);
  const discordOpen = Boolean(anchorDiscordEl);

  return (
    <MainLayout>
      <ThemeProvider theme={theme}>
        <div>
          <section className={s.top}>
            <div className={s.container}>
              <div className={s.top__items}>
                <div className={s.top__ava}>
                  {authData.info[7]?.avatar ? <Image
                    width="150px"
                    height="150px"
                    className={s.top__img}
                    src={authData.info[7].avatar}
                    alt="content__img"
                  /> :
                    <Avatar {...stringAvatar(authData.info[0]?.name + ' ' + authData.info[1]?.surname)}
                      sx={{ bgcolor: '#2A2550', width: '150px', height: '150px', fontSize: '35px' }} />
                  }

                </div>
                <div className={s.top__logotext}>
                  <h2>{authData.info[0]?.name} {authData.info[1]?.surname}</h2>
                </div>
              </div>
            </div>
          </section>

          <section className={s.info}>
            <div className={s.container}>
              <div className={s.info__inner}>
                <div className={s.panel + " " + s.info__info}>
                  {!isChanging ?
                    <div>
                      {isProfileUpdatingConfirmed && <Alert severity="success" color="primary" variant="filled"
                        sx={{ backgroundColor: '#4E9F3D', color: '#fff' }}>
                        Updating confirmed
                      </Alert>}

                      {infoOption === "info" ? (
                        <div>
                          <div className={s.info__menu}>

                            <Button
                              variant="contained"
                              color="secondary"
                              sx={{ width: "125px" }}
                            >
                              INFO
                            </Button>
                            <Button
                              variant="contained"
                              sx={{ width: "125px" }}
                              onClick={() => {
                                setInfo("stats");
                              }}
                            >
                              STATISTICS
                            </Button>

                            <div className={s.info__settingsIcon} onClick={() => {
                              setChanging(true)
                            }}>
                              <SettingsIcon fontSize="large" />
                            </div>

                          </div>

                          {authData.info.map((e, i) => {
                            const key = Object.keys(e)
                            const value = Object.values(e)

                            return (
                              <div key={i}>
                                {(key[0] !== '_id' && key[0] !== 'instagramLink' && key[0] !== 'telegramUsername'
                                  && key[0] !== 'discordUsername' && key[0] !== 'avatar') &&
                                  <div>
                                    <div className={s.info__infoItems}>
                                      <span className={s.info__infoItemName}>
                                        {key[0]}
                                      </span>
                                      <span className={s.info__infoItemValue}>
                                        {value[0] ?? "unknown"}
                                      </span>
                                    </div>

                                    {i !== authData.info.length - 5 && (
                                      <hr className={s.hrUnder} />
                                    )}
                                  </div>
                                }
                              </div>
                            );
                          })}
                          <div className={s.info__links}>
                            {authData.info[8]?.instagramLink && <div>
                              <Link href={authData.info[8].instagramLink}>
                                <a target='_blank'>
                                  <Image src={instagramIcon.src}
                                    width='50px'
                                    height='50px' 
                                    alt='instagramIcon'/>
                                </a>
                              </Link>
                            </div>}
                            {authData.info[9]?.telegramUsername && <div style={{cursor: 'pointer'}}>

                              <Image src={telegramIcon.src}
                                width='50px'
                                height='50px'
                                onMouseEnter={handlePopoverTelegramOpen}
                                onMouseLeave={handlePopoverTelegramClose}
                                alt='telegramIcon'
                                onClick={() => { 
                                  setTelegramCopy(true)
                                  setDiscordCopy(false)
                                  navigator.clipboard.writeText(authData.info[9].telegramUsername) 
                                }}
                              />

                              <Popover
                                id="mouse-over-popover"
                                sx={{
                                  pointerEvents: 'none',
                                }}
                                open={telegramOpen}
                                anchorEl={anchorTelegramEl}
                                anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'left',
                                }}
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'left',
                                }}
                                onClose={handlePopoverTelegramClose}
                                disableRestoreFocus
                                PaperProps={{
                                  sx: {
                                    backgroundColor: "rgb(5, 30, 52)",
                                    color: "#fff"
                                  }
                                }}
                              >
                                <Typography sx={{ p: 1 }}>{!isTelegramCopied ? 'Click to copy' : 'Copied!'}</Typography>
                              </Popover>

                            </div>}

                            {authData.info[10]?.discordUsername && <div style={{cursor: 'pointer'}}>

                              <Image src={discordIcon.src}
                                width='50px'
                                height='50px'
                                onMouseEnter={handlePopoverDiscordOpen}
                                onMouseLeave={handlePopoverDiscordClose}
                                alt='discordIcon'
                                onClick={() => { 
                                  setDiscordCopy(true)
                                  setTelegramCopy(false)
                                  navigator.clipboard.writeText(authData.info[10].discordUsername) 
                                }}
                              />

                              <Popover
                                id="mouse-over-popover"
                                sx={{
                                  pointerEvents: 'none',
                                }}
                                open={discordOpen}
                                anchorEl={anchorDiscordEl}
                                anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'left',
                                }}
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'left',
                                }}
                                onClose={handlePopoverDiscordClose}
                                disableRestoreFocus
                                PaperProps={{
                                  sx: {
                                    backgroundColor: "rgb(5, 30, 52)",
                                    color: "#fff"
                                  }
                                }}
                              >
                                <Typography sx={{ p: 1 }}>{!isDiscordCopied ? 'Click to copy' : 'Copied!'}</Typography>
                              </Popover>

                            </div>}
                          </div>

                        </div>
                      ) : (
                        <div>
                          <div className={s.info__menu}>
                            <Button
                              variant="contained"
                              sx={{ width: "125px" }}
                              onClick={() => {
                                setInfo("info");
                              }}
                            >
                              INFO
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              sx={{ width: "125px" }}
                            >
                              STATISTICS
                            </Button>
                          </div>
                          {authData.stats.map((e, i) => {
                            const value = Object.values(e)
                            return (
                              <div key={i}>
                                <div className={s.info__infoItems}>
                                  <span className={s.info__infoItemName}>
                                    {stats[i]}
                                  </span>
                                  <span className={s.info__infoItemValue}>
                                    {value[0]}
                                  </span>
                                </div>

                                {i !== authData.stats.length - 1 && (
                                  <hr className={s.hrUnder} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )} </div>
                    :
                    <ProfileChanging info={authData.info} setChanging={setChanging} />
                  }

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
                    Friends
                  </h3>

                  <div className={s.info__friendsItems}>

                    {(authData.friends.totalFriendsCount !== 0 && !isFriendsAdvanced) && (<div>
                      {authData.friends.confirmedFriends?.map((e, i) => {

                        return (
                          <div key={i}>
                            {(i <= 2) && (
                              <Link href={`/profile/${e.id}`}>
                              <a target='_blank'>
                                <div
                              className={
                                s.infoMemberItem +
                                " " +
                                s.infoMemberItem_margin_20px0
                              }
                            >
                              {e.avatar ? <Image
                                width="75px"
                                height="75px"
                                className={s.infoMemberItem__ava}
                                src={e.avatar}
                                alt="ava"
                              /> : <Avatar {...stringAvatar(e.name + ' ' + e.surname)}
                      sx={{ bgcolor: '#333C83', width: '75px', height: '75px', fontSize: '25px', fontFamily: 'Quicksand' }} />}

                              <div className={s.infoMemberItem__text}>
                                <span className={s.infoMemberItem__name}>
                                  {e.name}
                                </span>
                                <br />
                                <span className={s.infoMemberItem__surname}>
                                  {e.surname}
                                </span>
                              </div>
                            </div>
                            </a>
                            </Link>
                            )}
                            {(i !== authData.friends.confirmedFriends.length - 1 && i <= 1) && (
                              <hr className={s.hrUnder} />
                            )}
                          </div>
                        )
                      })}

                      {authData.friends.confirmedFriends?.length > 3 && <div className={s.showAndHide} onClick={() => {
                        setFriendsAdvanced(true)
                      }}>
                        Show {authData.friends.confirmedFriends.length - 3} more
                      </div>}
                    </div>
                    )}

                    {(authData.friends.totalFriendsCount !== 0 && isFriendsAdvanced) && (
                      <div>
                        {authData.friends.confirmedFriends.map((e, i) => {
                          return (
                            <div key={i}>
                              <Link href={`/profile/${e.id}`}>
                              <a target='_blank'>
                              <div
                                className={
                                  s.infoMemberItem +
                                  " " +
                                  s.infoMemberItem_margin_20px0
                                }
                              >
                              {e.avatar ? <Image
                                width="75px"
                                height="75px"
                                className={s.infoMemberItem__ava}
                                src={e.avatar}
                                alt="ava"
                              /> : <Avatar {...stringAvatar(e.name + ' ' + e.surname)}
                      sx={{ bgcolor: '#333C83', width: '75px', height: '75px', fontSize: '25px', fontFamily: 'Quicksand' }} />}

                                <div className={s.infoMemberItem__text}>
                                  <span className={s.infoMemberItem__name}>
                                    {e.name}
                                  </span>
                                  <br />
                                  <span className={s.infoMemberItem__surname}>
                                    {e.surname}
                                  </span>
                                </div>
                              </div>
                              </a>
                              </Link>
                              {i !== authData.friends.totalFriendsCount - 1 && (
                                <hr className={s.hrUnder} />
                              )}
                            </div>

                          );
                        })}
                        <div className={s.showAndHide} onClick={() => {
                          setFriendsAdvanced(false)
                        }}>
                          Hide
                        </div>
                      </div>
                    )
                    }

                    {authData.friends.totalFriendsCount === 0 && (
                      <div>
                        <Alert
                          severity="info"
                          color="primary"
                          variant="filled"
                          sx={{
                            backgroundColor: "rgb(2, 136, 209)",
                            color: "#fff",
                            width: '100%'
                          }}
                        >
                          You have no friends
                        </Alert></div>)}

                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </ThemeProvider>
    </MainLayout>
  );
}

function Pro2file(props) {

  const isAuthed = useSelector((state) => state.sign.isAuthed);
  const isAuthFulfilled = useSelector(state => state.sign.isAuthFulfilled)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthed && isAuthFulfilled) {

      router.push('/signup')

    }
  }, [isAuthFulfilled])


  return (
    <Profile {...props} />
  )
}

export default function InitialProfile(props) {
  const uniKey = useSelector(state => state.sign.uniKey)

  return <Pro2file key={uniKey} {...props} />
}


