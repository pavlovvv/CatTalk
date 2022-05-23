import MainLayout from "../../components/MainLayout.jsx";
import Image from "next/image";
import s from "../../styles/profile.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, createTheme, ThemeProvider, Alert, Avatar, Popover, Typography, CircularProgress } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { setDynamicPage } from "../../redux/signSlice.js";
import { addFriend, refuseOwnFriendRequest, deleteFriend } from "../../redux/usersSlice.js";
import instagramIcon from '../../images/Instagram_icon.webp'
import telegramIcon from '../../images/Telegram_icon.webp'
import discordIcon from '../../images/discord-icon.svg'

export async function getStaticPaths() {

  const paths = []

  for (let i = 1; i <= 150; i++) {
      paths.push({params: {id: i.toString()}}) 
  }

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps({ params }) {

  const res = await fetch(`https://cattalkapi.herokuapp.com/users/search/${params.id}`)
  const user = await res.json();

  return { props: { userData: user } }
}


export default function Profile(props) {

  const [info, setInform] = useState([])
  const [stats, setStats] = useState([])
  const [friends, setFriends] = useState([])
  const [infoOption, setInfo] = useState("info");
  const [isFriendsAdvanced, setFriendsAdvanced] = useState(false)
  const [isFriend, setFriend] = useState([])
  const [isFriendPending, setFriendPending] = useState([])
  const authData = useSelector(state => state.sign.userData)
  const isProfilePending = useSelector(state => state.users.isProfilePending)
  const key = useSelector(state => state.users.key)
  const isDone = useSelector(state => state.sign.isProfileDone)
  const isAuthed = useSelector((state) => state.sign.isAuthed);
  const isProfileUpdatingConfirmed = useSelector(state => state.sign.isProfileUpdatingConfirmed)

  const router = useRouter()

  const dispatch = useDispatch()

  useEffect(() => {

    dispatch(setDynamicPage({isDynamicPage: true}))
    if (props.userData) {

      if (props.userData?.msg) {
        return function unknown(){
        return;}
      }
      
      else {
        setInform(Object.entries(props.userData.info).map(entry => ({ [entry[0]]: entry[1] })))
        setStats(Object.entries(props.userData.stats).map(entry => ({ [entry[0]]: entry[1] })))
        setFriends(props.userData.friends)
      }

      if (authData) {
        debugger
        const friend = authData.friends.confirmedFriends?.filter(e => {
          if (e.id === props.userData.info.id) return e
        })

        setFriend(friend)

        const pendingFriend = authData.friends.pendingFriends?.filter(e => {
          if (e.id === props.userData.info.id) return e
        })

        setFriendPending(pendingFriend)

      }

    }

    if (key > 0) {
      router.push(router.asPath)
    }
  }, [props, authData, key])

  const statistics = [
    "Total chats", "Total messages sent", "Total entered characters"
  ];


  const theme = createTheme({
    palette: {
      secondary: {
        main: "#333C83",
      },
    },
  });

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
        {!props.userData?.msg ?         <div>
          <section className={s.top}>
            <div className={s.container}>
              <div className={s.top__items}>
                <div className={s.top__ava}>
                  {info[7]?.avatar ? <Image
                    width="150px"
                    height="150px"
                    className={s.top__img}
                    src={info[7].avatar}
                    alt="content__img"
                  /> :
                    <Avatar {...stringAvatar(info[0]?.name + ' ' + info[1]?.surname)}
                      sx={{ bgcolor: '#2A2550', width: '150px', height: '150px', fontSize: '35px' }} />
                  }

                </div>
                <div className={s.top__logotext}>
                  <h2>{info[0]?.name} {info[1]?.surname}</h2>
                </div>
              </div>
            </div>
          </section>

          <section className={s.info}>
            <div className={s.container}>
              <div className={s.info__inner}>
                <div className={s.panel + " " + s.info__info}>
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
                            sx={{ width: '125px' }}
                          >
                            INFO
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ width: '125px' }}
                            onClick={() => {
                              setInfo("stats");
                            }}
                          >
                            STATISTICS
                          </Button>

                          {isAuthed && authData.info[4]?.id !== info[4]?.id && 
                          <>{isFriend?.length === 0 && isFriendPending?.length === 0 && <Button
                            color='success'
                            variant="contained"
                            sx={{ backgroundColor: '#4E9F3D', color: '#fff' }}
                            onClick={() => {
                              dispatch(addFriend({ id: info[4].id, name: info[0].name, surname: info[1].surname,
                                 username: info[2].username, avatar: info[7].avatar }))
                            }}
                            disabled={isProfilePending || isDone}
                          >
                            {isProfilePending || isDone ? <div style={{ color: '#fff', display: 'flex', alignItems: 'center', columnGap: '10px' }}><CircularProgress size={30} sx={{ color: "#fff" }} /> Add friend </div> : 'Add friend'}
                          </Button>}


                            {isFriendPending?.length !== 0 && <Button
                              color='success'
                              variant="outlined"
                              sx={{ borderColor: '#4E9F3D', color: '#4E9F3D' }}
                              onClick={() => {
                                dispatch(refuseOwnFriendRequest({ id: info[4].id }))
                              }}
                              disabled={isProfilePending || isDone}
                            >
                              {isProfilePending || isDone ? <div style={{ color: '#fff', display: 'flex', alignItems: 'center', columnGap: '10px' }}><CircularProgress size={30} sx={{ color: "#fff" }} />
                                Request has been sent </div> : 'Request has been sent'}
                            </Button>}

                            {isFriend?.length !== 0 && <Button
                              color='error'
                              variant="contained"
                              sx={{ backgroundColor: "rgb(211, 47, 47)", color: "#fff" }}
                              disabled={isProfilePending || isDone}
                              onClick={() => {
                                dispatch(deleteFriend({ id: info[4].id }))
                              }}
                            >
                              {isProfilePending || isDone ? <div style={{ color: '#fff', display: 'flex', alignItems: 'center', columnGap: '10px' }}><CircularProgress size={30} sx={{ color: "#fff" }} />
                                Delete friend </div> : 'Delete friend'}
                            </Button>}</>}

                        </div>

                        {info.map((e, i) => {
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

                                  {i !== info.length - 5 && (
                                    <hr className={s.hrUnder} />
                                  )}
                                </div>
                              }
                            </div>
                          );
                        })}

                        <div className={s.info__links}>
                          {info[8]?.instagramLink && <div>
                            <Link href={info[8].instagramLink}>
                              <a target='_blank'>
                                <img src={instagramIcon.src}
                              style={{width:'50px', height: '50px'}}
                                  alt='instagramIcon'
                                  />
                              </a>
                            </Link>
                          </div>}
                          {info[9]?.telegramUsername && <div style={{ cursor: 'pointer' }}>

                            <img src={telegramIcon.src}
                              style={{width:'50px', height: '50px'}}
                              onMouseEnter={handlePopoverTelegramOpen}
                              onMouseLeave={handlePopoverTelegramClose}
                              alt='telegramIcon'
                              onClick={() => {
                                setTelegramCopy(true)
                                setDiscordCopy(false)
                                navigator.clipboard.writeText(info[9].telegramUsername)
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

                          {info[10]?.discordUsername && <div style={{ cursor: 'pointer' }}>

                            <img src={discordIcon.src}
                              style={{width:'50px', height: '50px'}}
                              onMouseEnter={handlePopoverDiscordOpen}
                              onMouseLeave={handlePopoverDiscordClose}
                              alt='discordIcon'
                              onClick={() => {
                                setDiscordCopy(true)
                                setTelegramCopy(false)
                                navigator.clipboard.writeText(info[10].discordUsername)
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

                          {isAuthed && authData.info[4]?.id !== info[4]?.id && 
                          <>{isFriend?.length === 0 && isFriendPending?.length === 0 && <Button
                            color='success'
                            variant="contained"
                            sx={{ backgroundColor: '#4E9F3D', color: '#fff' }}
                            onClick={() => {
                              dispatch(addFriend({ id: info[4].id, username: info[2].username, avatar: info[7].avatar }))
                            }}
                            disabled={isProfilePending || isDone}
                          >
                            {isProfilePending || isDone ? <div style={{ color: '#fff', display: 'flex', alignItems: 'center', columnGap: '10px' }}><CircularProgress size={30} sx={{ color: "#fff" }} /> Add friend </div> : 'Add friend'}
                          </Button>}


                            {isFriendPending?.length !== 0 && <Button
                              color='success'
                              variant="outlined"
                              sx={{ borderColor: '#4E9F3D', color: '#4E9F3D' }}
                              onClick={() => {
                                dispatch(refuseOwnFriendRequest({ id: info[4].id }))
                              }}
                              disabled={isProfilePending || isDone}
                            >
                              {isProfilePending || isDone ? <div style={{ color: '#fff', display: 'flex', alignItems: 'center', columnGap: '10px' }}><CircularProgress size={30} sx={{ color: "#fff" }} />
                                Request has been sent </div> : 'Request has been sent'}
                            </Button>}

                            {isFriend?.length !== 0 && <Button
                              color='error'
                              variant="contained"
                              sx={{ backgroundColor: "rgb(211, 47, 47)", color: "#fff" }}
                              disabled={isProfilePending || isDone}
                              onClick={() => {
                                dispatch(deleteFriend({ id: info[4].id }))
                              }}
                            >
                              {isProfilePending || isDone ? <div style={{ color: '#fff', display: 'flex', alignItems: 'center', columnGap: '10px' }}><CircularProgress size={30} sx={{ color: "#fff" }} />
                                Delete friend </div> : 'Delete friend'}
                            </Button>}</>}
                        </div>
                        {stats.map((e, i) => {
                          const value = Object.values(e)
                          return (
                            <div key={i}>
                              <div className={s.info__infoItems}>
                                <span className={s.info__infoItemName}>
                                  {statistics[i]}
                                </span>
                                <span className={s.info__infoItemValue}>
                                  {value[0]}
                                </span>
                              </div>

                              {i !== stats.length - 1 && (
                                <hr className={s.hrUnder} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )} </div>


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
                    FRIENDS
                  </h3>

                  <div className={s.info__friendsItems}>

                    {(friends.totalFriendsCount !== 0 && !isFriendsAdvanced) && (<div>
                      {friends.confirmedFriends?.map((e, i) => {
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
                            {(i !== friends.confirmedFriends.length - 1 && i <= 1) && (
                              <hr className={s.hrUnder} />
                            )}
                          </div>
                        )
                      })}

                      {friends.confirmedFriends?.length > 3 && <div className={s.showAndHide} onClick={() => {
                        setFriendsAdvanced(true)
                      }}>
                        Show {friends.confirmedFriends.length - 3} more
                      </div>}
                    </div>
                    )}

                    {(friends.totalFriendsCount !== 0 && isFriendsAdvanced) && (
                      <div>
                        {friends.confirmedFriends.map((e, i) => {
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
                              {i !== friends.length - 1 && (
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

                    {friends.totalFriendsCount === 0 && (
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
                          He/she has no friends
                        </Alert></div>)}

                  </div>
                </div>
              </div>
            </div>
          </section>
        </div> : <div style={{minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px'}}>Unknown user</div>}

      </ThemeProvider>
    </MainLayout>
  );
}

